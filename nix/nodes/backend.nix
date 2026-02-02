# Backend server configuration
{ config, lib, ... }:
{
  imports = [ ./base.nix ];

  # enable the backend service
  services.backend = {
    enable = true;
    database = {
      # these get overridden per-node in the nixosConfigurations
      addr = lib.mkDefault "127.0.0.1";
      port = lib.mkDefault 5432;
    };
  };

  # allow http/https for the reverse proxy
  networking.firewall.allowedTCPPorts = [ 80 443 ];
}
