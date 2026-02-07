module {
  // Only drop the password, no further data transformation needed
  type OldActor = {
    ownerPassword : Text;
  };

  // New actor has no password
  type NewActor = {};

  public func run(_old : OldActor) : NewActor {
    {};
  };
};
