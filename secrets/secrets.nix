let
  # Team SSH public keys
  # Grab from: https://gitlab.scss.tcd.ie/<username>.keys
  # After adding a new key, rekey all secrets: ragenix -r
  joshi = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIAMeaoHb1PbGrDkhYduSLkFm+oM30W/8r0U5qbz/XxQy joshid@tcd.ie";
  # luke = "ssh-ed25519 AAAA... luke@tcd.ie";

  allUsers = [ joshi ];
in
{
  "db-password.age".publicKeys = allUsers;
  "db-superuser-password.age".publicKeys = allUsers;
}
