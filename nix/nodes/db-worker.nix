# Citus worker node configuration
{ ... }:
{
  imports = [ ./base.nix ];

  services.postgres-distributed = {
    enable = true;
    isCoordinator = false;
    coordinatorAddress = "db-coordinator.toast.internal";
  };
}
