# Citus worker node configuration
{ ... }:
{
  flake.nixosModules.dbWorker =
    { ... }:
    {
      services.postgres-distributed = {
        enable = true;
        isCoordinator = false;
        coordinatorAddress = "db-coordinator.toast.internal";
      };
    };
}
