# Tailscale client - connects nodes to the Headscale mesh network
_: {
  flake.nixosModules.tailscaleClient =
    { config, lib, ... }:
    let
      cfg = config.services.toast-tailscale;
    in
    {
      options.services.toast-tailscale = {
        enable = lib.mkEnableOption "Tailscale mesh networking";

        headscaleUrl = lib.mkOption {
          description = "URL of the Headscale coordination server";
          type = lib.types.str;
          default = "http://headscale.toast.internal:8080";
        };

        authKeyFile = lib.mkOption {
          description = "Path to file containing the pre-auth key for automatic registration";
          type = lib.types.nullOr lib.types.path;
          default = null;
        };
      };

      config = lib.mkIf cfg.enable {
        services.tailscale = {
          enable = true;
          port = 41641;
          useRoutingFeatures = "client";
          inherit (cfg) authKeyFile;
          extraUpFlags = [
            "--login-server"
            cfg.headscaleUrl
          ];
        };

        # tailscale UDP port (already in base.nix but explicit here)
        networking.firewall.allowedUDPPorts = [ 41641 ];

        # trust tailscale interface for internal traffic
        networking.firewall.trustedInterfaces = [ "tailscale0" ];
      };
    };
}
