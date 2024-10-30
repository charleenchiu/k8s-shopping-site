## Functionality Report - `master_ubuntu.yml`

### File Overview
This file is an Ansible Playbook designed to configure Ubuntu hosts to run an Apache web server and mount Amazon EFS (Elastic File System). The Playbook includes system updates, installation of necessary services (such as Apache, Git, and NFS clients), and fetching static website content from GitHub to synchronize with Amazon S3.

### Playbook Structure

---

#### Beginning of the File

```yaml
---
- hosts: all
  become: true
```

The Playbook starts with the `---` marker, setting `hosts: all` to apply to all specified hosts, and `become: true` to execute operations with administrator privileges.

---

### Part One: System Update and Basic Package Installation

**Function**: Ensure the system is updated to the latest version and install Apache and Git to provide necessary support for the static website server.

- `update`: Updates the package index for all software packages.
- `Install httpd`: Installs the Apache2 web server.
- `Start` and `Enable httpd`: Starts and enables Apache2 to launch at boot.
- `Install git`: Installs Git for version control.

---

### Part Two: EFS File System Mounting Setup

**Function**: Install the NFS client and mount Amazon EFS so that the static website data can be stored in the elastic file system.

- **Install NFS client**: Uses the `nfs-common` package to support the NFS protocol.
- **Ensure mount directory exists**: Creates the local mount directory `/var/www/html`.
- **Get EC2 Metadata**: Obtains the AWS region from the EC2 instance to configure the EFS DNS.
- **Set EFS DNS name**: Configures the EFS DNS name based on the region and file system ID.
- **Mount EFS**: Mounts EFS to `/var/www/html` and sets mount options.
- **Confirm successful mount**: Lists files in the mount directory to verify that the mount was successful.

---

### Part Three: Auto-mounting at Boot and Static Website Code Synchronization

**Function**: Configure automatic mounting of EFS in `/etc/fstab` and clone static website code from GitHub to the EFS mounted directory.

- **Edit fstab**: Writes the EFS mount instruction to `/etc/fstab` for automatic mounting after reboot.
- **Clone repository**: Clones the static website code from GitHub into the EFS mounted directory.

---

### Extension Part: Synchronizing Static Website to S3

The last part of this Playbook includes tasks to synchronize website content to S3. If the goal is to store static files for the website and use them in services like AWS CloudFront, the following tasks can be used:

- **Install awscli**: Installs `awscli` to support AWS data operations.
- **Clone website repository**: Clones website content to the local EFS mounted directory.
- **Upload to S3**: Uses `aws s3 sync` to synchronize static website content to the S3 bucket.

---

### Conclusion

This Playbook provides a complete system setup process, supporting the Apache web server, Git version control, NFS service, and automatic mounting of EFS file systems on Ubuntu hosts, with optional synchronization of static websites to S3. This process ensures that static website code can be automatically loaded after reboot and can continuously synchronize with S3 for backup or as a content source for a CDN.