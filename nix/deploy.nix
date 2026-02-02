# deploy-rs configuration for deploying NixOS to our EC2 instances
{ inputs, ... }:
{
  flake.deploy = {
    # use the local machine's ssh agent
    sshUser = "root";

    # node definitions for each server we want to deploy to
    nodes = {
      # backend server in region A (eu-west-1)
      backend-a = {
        hostname = "backend-a.toast.internal";
        profiles.system = {
          user = "root";
          path = inputs.deploy-rs.lib.x86_64-linux.activate.nixos
            inputs.self.nixosConfigurations.backend-a;
        };
      };

      # backend server in region B (eu-west-2)
      backend-b = {
        hostname = "backend-b.toast.internal";
        profiles.system = {
          user = "root";
          path = inputs.deploy-rs.lib.x86_64-linux.activate.nixos
            inputs.self.nixosConfigurations.backend-b;
        };
      };

      # citus coordinator node
      db-coordinator = {
        hostname = "db-coordinator.toast.internal";
        profiles.system = {
          user = "root";
          path = inputs.deploy-rs.lib.x86_64-linux.activate.nixos
            inputs.self.nixosConfigurations.db-coordinator;
        };
      };

      # citus worker node 1
      db-worker-1 = {
        hostname = "db-worker-1.toast.internal";
        profiles.system = {
          user = "root";
          path = inputs.deploy-rs.lib.x86_64-linux.activate.nixos
            inputs.self.nixosConfigurations.db-worker-1;
        };
      };

      # citus worker node 2
      db-worker-2 = {
        hostname = "db-worker-2.toast.internal";
        profiles.system = {
          user = "root";
          path = inputs.deploy-rs.lib.x86_64-linux.activate.nixos
            inputs.self.nixosConfigurations.db-worker-2;
        };
      };
    };
  };

  # add deploy-rs checks to make sure configs are valid
  perSystem = { system, ... }: {
    checks = inputs.deploy-rs.lib.${system}.deployChecks inputs.self.deploy;
  };
}
