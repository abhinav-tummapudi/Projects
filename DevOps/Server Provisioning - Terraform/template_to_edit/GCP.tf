provider "google" {
    project = "starry-descent-318115"
    region = "us-central1"
    zone = "us-central1-a"
	credentials = "${file("gcp-key.json")}"
}

resource "google_compute_instance" "vm_instance" {
  name         = "ANGULAR_EDIT1"
  machine_type = "n1-standard-2"
  allow_stopping_for_update = true
  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-9"
    }
  }

  network_interface {
    # A default network is created for all GCP projects
    network = google_compute_network.vpc_network.self_link
    access_config {
    }
  }
}

resource "google_compute_network" "vpc_network" {
  name                    = "ANGULAR_EDIT2"
  auto_create_subnetworks = "true"
}
