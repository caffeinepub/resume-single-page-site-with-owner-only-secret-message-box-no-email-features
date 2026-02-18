import Set "mo:core/Set";
import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Application Types
  public type RecruiterVisit = {
    companyName : ?Text;
    timestamp : Time.Time;
  };

  public type VisitorMessage = {
    name : Text;
    email : Text;
    message : Text;
    timestamp : Time.Time;
  };

  public type ContactDetails = {
    address : Text;
    phone : Text;
    email : Text;
  };

  public type Content = {
    heroText : Text;
    education : [EducationEntry];
    experience : [ExperienceItem];
    certifications : [Certification];
    hobbies : [Text];
    projects : [Project];
    contact : ContactDetails;
  };

  public type EducationEntry = {
    institution : Text;
    degree : Text;
    year : Nat;
  };

  public type ExperienceItem = {
    company : Text;
    position : Text;
    duration : Text;
    description : Text;
  };

  public type Certification = {
    name : Text;
    issuer : Text;
    year : Nat;
  };

  public type Project = {
    title : Text;
    description : Text;
    link : Text;
    details : Text;
  };

  public type Skill = {
    name : Text;
    level : Text; // e.g., "Beginner", "Intermediate", "Advanced"
  };

  public type UserProfile = {
    name : Text;
  };

  // State Definitions
  var recruiterVisits = List.empty<RecruiterVisit>();
  var visitorMessages = List.empty<VisitorMessage>();
  var skills = Set.empty<Text>();
  let ownerPassword = "BirdOnTree3";
  var content = {
    heroText = "Welcome to my resume!";
    education = [] : [EducationEntry];
    experience = [] : [ExperienceItem];
    certifications = [] : [Certification];
    hobbies = [] : [Text];
    projects = [] : [Project];
    contact = {
      address = "Turku, Finland";
      phone = "+358 49 5029094";
      email = "niklas.liebmann@gmail.com";
    };
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Methods
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Public Methods (No authentication required)
  public shared ({ caller }) func logRecruiterVisit(isRecruiter : Bool, companyName : ?Text) : async () {
    if (not isRecruiter) { return };

    let visit : RecruiterVisit = {
      companyName;
      timestamp = Time.now();
    };
    recruiterVisits.add(visit);
  };

  public shared ({ caller }) func submitVisitorMessage(name : Text, email : Text, message : Text) : async () {
    let visitorMessage : VisitorMessage = {
      name;
      email;
      message;
      timestamp = Time.now();
    };
    visitorMessages.add(visitorMessage);
  };

  public query ({ caller }) func getContent() : async Content {
    content;
  };

  public query ({ caller }) func getSkills() : async [Text] {
    skills.toArray();
  };

  // Password-gated Owner Panel Methods
  public query ({ caller }) func getRecruiterVisitsWithPassword(password : Text) : async [RecruiterVisit] {
    if (password != ownerPassword) {
      Runtime.trap("Unauthorized: Incorrect password");
    };
    recruiterVisits.toArray();
  };

  public query ({ caller }) func getVisitorMessagesWithPassword(password : Text) : async [VisitorMessage] {
    if (password != ownerPassword) {
      Runtime.trap("Unauthorized: Incorrect password");
    };
    visitorMessages.toArray();
  };

  public shared ({ caller }) func updateContentWithPassword(password : Text, newContent : Content) : async () {
    if (password != ownerPassword) {
      Runtime.trap("Unauthorized: Incorrect password");
    };
    content := newContent;
  };

  public shared ({ caller }) func addSkillWithPassword(password : Text, skill : Text) : async () {
    if (password != ownerPassword) {
      Runtime.trap("Unauthorized: Incorrect password");
    };
    skills.add(skill);
  };

  public shared ({ caller }) func removeSkillWithPassword(password : Text, skill : Text) : async () {
    if (password != ownerPassword) {
      Runtime.trap("Unauthorized: Incorrect password");
    };
    if (not skills.contains(skill)) {
      Runtime.trap("Skill does not exist");
    };
    skills.remove(skill);
  };

  public shared ({ caller }) func clearSkillsWithPassword(password : Text) : async () {
    if (password != ownerPassword) {
      Runtime.trap("Unauthorized: Incorrect password");
    };
    skills := Set.empty<Text>();
  };

  public shared ({ caller }) func clearVisitorMessagesWithPassword(password : Text) : async () {
    if (password != ownerPassword) {
      Runtime.trap("Unauthorized: Incorrect password");
    };
    visitorMessages := List.empty<VisitorMessage>();
  };

  public shared ({ caller }) func clearRecruiterVisitsWithPassword(password : Text) : async () {
    if (password != ownerPassword) {
      Runtime.trap("Unauthorized: Incorrect password");
    };
    recruiterVisits := List.empty<RecruiterVisit>();
  };
};
