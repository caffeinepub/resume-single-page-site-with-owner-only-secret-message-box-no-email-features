import Set "mo:core/Set";
import List "mo:core/List";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Migration "migration";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Apply data migration on upgrade.
(with migration = Migration.run)
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

  // State
  var recruiterVisits = List.empty<RecruiterVisit>();
  var visitorMessages = List.empty<VisitorMessage>();
  var skills = Set.empty<Text>();
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

  // Public Methods - No authentication required (guests can access)
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

  // Admin Panel Methods (role-based access control)
  public query ({ caller }) func getRecruiterVisits() : async [RecruiterVisit] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view recruiter visits");
    };
    recruiterVisits.toArray();
  };

  public query ({ caller }) func getVisitorMessages() : async [VisitorMessage] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view visitor messages");
    };
    visitorMessages.toArray();
  };

  public shared ({ caller }) func updateContent(newContent : Content) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update content");
    };
    content := newContent;
  };

  public shared ({ caller }) func addSkill(skill : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add skills");
    };
    skills.add(skill);
  };

  public shared ({ caller }) func removeSkill(skill : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can remove skills");
    };
    if (not skills.contains(skill)) {
      Runtime.trap("Skill does not exist");
    };
    skills.remove(skill);
  };

  public shared ({ caller }) func clearSkills() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can clear skills");
    };
    skills := Set.empty<Text>();
  };

  public shared ({ caller }) func clearVisitorMessages() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can clear visitor messages");
    };
    visitorMessages := List.empty<VisitorMessage>();
  };

  public shared ({ caller }) func clearRecruiterVisits() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can clear recruiter visits");
    };
    recruiterVisits := List.empty<RecruiterVisit>();
  };
};

