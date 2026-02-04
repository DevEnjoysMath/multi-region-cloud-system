{ inputs, ... }:
{
  imports = [ inputs.treefmt-nix.flakeModule ];

  perSystem.treefmt = {
    projectRootFile = "flake.nix";

    programs = {
      deadnix.enable = true;
      nixfmt.enable = true;
      statix.enable = true;
      nixf-diagnose.enable = true;

      yamlfmt.enable = true;

      prettier.enable = true;

      google-java-format.enable = true;
      ktfmt.enable = true;
      ktlint.enable = true;

      shellcheck = {
        enable = true;
        excludes = [
          ".envrc"
        ];
      };
      shfmt.enable = true;
    };
  };
}
