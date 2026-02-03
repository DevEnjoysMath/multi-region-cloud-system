# Backend server node configuration
{ ... }:
{
  flake.nixosModules.backendNode =
    { lib, ... }:
    {
      services.backend = {
        enable = true;
        database = {
          addr = lib.mkDefault "db-coordinator.toast.internal";
          port = lib.mkDefault 5432;
        };
      };
    };
}
