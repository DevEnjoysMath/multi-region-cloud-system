# NixOS configurations for our EC2 instances
{ self, inputs, ... }:
let
  # helper to create a nixos system config
  mkSystem = modules: inputs.nixpkgs.lib.nixosSystem {
    system = "x86_64-linux";
    modules = modules ++ [
      # include our custom modules
      self.nixosModules.backend
      self.nixosModules.postgres
    ];
    specialArgs = { inherit self inputs; };
  };
in
{
  flake.nixosConfigurations = {
    # backend servers
    backend-a = mkSystem [
      ./nodes/backend.nix
      {
        networking.hostName = "backend-a";
        services.backend.database.addr = "db-coordinator.toast.internal";
      }
    ];

    backend-b = mkSystem [
      ./nodes/backend.nix
      {
        networking.hostName = "backend-b";
        services.backend.database.addr = "db-coordinator.toast.internal";
      }
    ];

    # database nodes
    db-coordinator = mkSystem [
      ./nodes/db-coordinator.nix
      { networking.hostName = "db-coordinator"; }
    ];

    db-worker-1 = mkSystem [
      ./nodes/db-worker.nix
      { networking.hostName = "db-worker-1"; }
    ];

    db-worker-2 = mkSystem [
      ./nodes/db-worker.nix
      { networking.hostName = "db-worker-2"; }
    ];
  };
}
