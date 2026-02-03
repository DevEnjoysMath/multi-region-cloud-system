# Base configuration shared by all nodes
{ ... }:
{
  flake.nixosModules.base =
    { modulesPath, ... }:
    {
      imports = [
        "${modulesPath}/virtualisation/amazon-image.nix"
      ];

      # allow ssh access for deployments
      services.openssh.enable = true;

      # use nftables instead of iptables (faster and more secure)
      networking.nftables.enable = true;

      # basic firewall - tailscale will handle internal networking
      networking.firewall = {
        enable = true;
        allowedUDPPorts = [ 41641 ]; # tailscale
      };

      # nix settings
      nix.settings = {
        experimental-features = [ "nix-command" "flakes" ];
        trusted-users = [ "root" ];
      };

      system.stateVersion = "25.11";
    };
}
