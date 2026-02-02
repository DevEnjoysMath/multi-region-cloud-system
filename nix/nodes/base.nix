# Base configuration shared by all nodes
{ modulesPath, ... }:
{
  imports = [
    # EC2 hardware configuration
    "${modulesPath}/virtualisation/amazon-image.nix"
  ];

  # allow ssh access for deployments
  services.openssh.enable = true;

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

  system.stateVersion = "24.05";
}
