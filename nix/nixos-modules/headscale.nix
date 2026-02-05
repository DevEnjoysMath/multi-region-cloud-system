# Headscale - self-hosted Tailscale coordination server
_:
{
  flake.nixosModules.headscale =
    { config, lib, ... }:
    let
      cfg = config.services.toast-headscale;
    in
    {
      options.services.toast-headscale = {
        enable = lib.mkEnableOption "Headscale coordination server";

        domain = lib.mkOption {
          description = "Base domain for the mesh network";
          type = lib.types.str;
          default = "toast.internal";
        };

        port = lib.mkOption {
          description = "Port for the Headscale server";
          type = lib.types.port;
          default = 8080;
        };
      };

      config = lib.mkIf cfg.enable {
        services.headscale = {
          enable = true;
          address = "0.0.0.0";
          inherit (cfg) port;

          settings = {
            server_url = "http://headscale.${cfg.domain}:${toString cfg.port}";

            dns = {
              base_domain = cfg.domain;
              magic_dns = true;
              nameservers.global = [
                "1.1.1.1"
                "8.8.8.8"
              ];
            };

            prefixes = {
              v4 = "100.64.0.0/10";
              v6 = "fd7a:115c:a1e0::/48";
            };
          };
        };

        # open headscale port
        networking.firewall.allowedTCPPorts = [ cfg.port ];
      };
    };
}
