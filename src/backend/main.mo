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

  // User Profile Type
  public type UserProfile = {
    name : Text;
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

  public type Content = {
    heroText : Text;
    education : [EducationEntry];
    experience : [ExperienceItem];
    skills : [Text];
    certifications : [Certification];
    hobbies : [Text];
    projects : [Project];
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

  // State
  var recruiterVisits = List.empty<RecruiterVisit>();
  var visitorMessages = List.empty<VisitorMessage>();
  var content = {
    heroText = "Welcome to my resume!";
    education = [] : [EducationEntry];
    experience = [] : [ExperienceItem];
    skills = [] : [Text];
    certifications = [] : [Certification];
    hobbies = [] : [Text];
    projects = [] : [Project];
  };

  // Password for owner access panel
  let ownerPanelPassword = "BirdOnTree3";

  // Public Methods - No authorization required

  // Public: Anyone can log a recruiter visit
  public shared ({ caller }) func logRecruiterVisit(isRecruiter : Bool, companyName : ?Text) : async () {
    if (not isRecruiter) { return };

    let visit : RecruiterVisit = {
      companyName;
      timestamp = Time.now();
    };
    recruiterVisits.add(visit);
  };

  // Public: Anyone can submit a visitor message
  public shared ({ caller }) func submitVisitorMessage(name : Text, email : Text, message : Text) : async () {
    let visitorMessage : VisitorMessage = {
      name;
      email;
      message;
      timestamp = Time.now();
    };
    visitorMessages.add(visitorMessage);
  };

  // Public: Anyone can view content
  public query ({ caller }) func getContent() : async Content {
    content;
  };

  // Owner-Only Methods - Password protected

  // Owner only: Update site content with password
  public shared ({ caller }) func updateContent(newContent : Content, password : Text) : async () {
    checkPassword(password);
    content := newContent;
  };

  // Owner only: View recruiter visits with password
  public query ({ caller }) func getRecruiterVisits(password : Text) : async [RecruiterVisit] {
    checkPassword(password);
    recruiterVisits.toArray();
  };

  // Owner only: View visitor messages with password
  public query ({ caller }) func getVisitorMessages(password : Text) : async [VisitorMessage] {
    checkPassword(password);
    visitorMessages.toArray();
  };

  // Owner only: Clear visitor messages with password
  public shared ({ caller }) func clearVisitorMessages(password : Text) : async () {
    checkPassword(password);
    visitorMessages := List.empty<VisitorMessage>();
  };

  // Owner only: Clear recruiter visit logs with password
  public shared ({ caller }) func clearRecruiterVisits(password : Text) : async () {
    checkPassword(password);
    recruiterVisits := List.empty<RecruiterVisit>();
  };

  // Helper function to check owner password
  func checkPassword(password : Text) : () {
    if (password != ownerPanelPassword) {
      Runtime.trap("Unauthorized: Incorrect password for owner panel");
    };
  };
};
