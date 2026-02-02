# Citus coordinator node configuration
{ ... }:
{
  imports = [ ./base.nix ];

  services.postgres-distributed = {
    enable = true;
    isCoordinator = true;
    coordinatorAddress = "db-coordinator.toast.internal";
    workerNodes = [
      "db-worker-1.toast.internal"
      "db-worker-2.toast.internal"
    ];
  };
}
