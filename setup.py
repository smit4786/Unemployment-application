import sys
import os
import subprocess
import shutil

# --- Configuration ---
MIN_PYTHON_VERSION = (3, 9)
API_DIR = "api"
REQUIREMENTS_FILE = os.path.join(API_DIR, "requirements.txt")
ENV_EXAMPLE_FILE = os.path.join(API_DIR, ".env.example")
ENV_FILE = os.path.join(API_DIR, ".env")

# --- Helper Functions ---
def print_color(text, color):
    """Prints text in a given color."""
    colors = {
        "green": "\033[92m",
        "yellow": "\033[93m",
        "red": "\033[91m",
        "bold": "\033[1m",
        "end": "\033[0m",
    }
    print(f"{colors.get(color, '')}{text}{colors['end']}")

def check_command(command):
    """Checks if a command exists."""
    return shutil.which(command) is not None

def run_command(command, cwd=None):
    """Runs a command and streams its output."""
    try:
        process = subprocess.Popen(
            command,
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            cwd=cwd
        )
        while True:
            output = process.stdout.readline()
            if output == '' and process.poll() is not None:
                break
            if output:
                print(output.strip())
        return process.poll() == 0
    except Exception as e:
        print_color(f"Error running command '{command}': {e}", "red")
        return False

# --- Setup Steps ---
def check_python_version():
    """Checks if the Python version is sufficient."""
    print_color("\n1. Checking Python version...", "bold")
    if sys.version_info >= MIN_PYTHON_VERSION:
        print_color(f"  [✓] Python {sys.version_info.major}.{sys.version_info.minor} or newer is installed.", "green")
        return True
    else:
        print_color(f"  [✗] Python {MIN_PYTHON_VERSION[0]}.{MIN_PYTHON_VERSION[1]}+ is required. You have {sys.version_info.major}.{sys.version_info.minor}.", "red")
        return False

def check_node_version():
    """Checks if Node.js and npm are installed."""
    print_color("\n2. Checking for Node.js and npm...", "bold")
    if not check_command("node") or not check_command("npm"):
        print_color("  [✗] Node.js and/or npm are not installed. Please install them to build the frontend.", "red")
        print("      Visit https://nodejs.org/ to install.")
        return False
    else:
        print_color("  [✓] Node.js and npm are installed.", "green")
        return True

def setup_environment_file():
    """Creates a .env file from the example if it doesn't exist."""
    print_color("\n3. Setting up environment file...", "bold")
    if os.path.exists(ENV_FILE):
        print_color(f"  [✓] Environment file '{ENV_FILE}' already exists.", "green")
        return True

    if not os.path.exists(ENV_EXAMPLE_FILE):
        print_color(f"  [!] Could not find '{ENV_EXAMPLE_FILE}'. Cannot create .env file.", "yellow")
        print("      Please create it manually with SERPAPI_KEY.")
        return False

    try:
        shutil.copy(ENV_EXAMPLE_FILE, ENV_FILE)
        print_color(f"  [✓] Created '{ENV_FILE}' from example.", "green")
        print_color("  [!] IMPORTANT: You must now edit 'api/.env' and add your API keys.", "yellow")
        return True
    except Exception as e:
        print_color(f"  [✗] Failed to create '{ENV_FILE}': {e}", "red")
        return False

def install_python_dependencies():
    """Installs Python dependencies from requirements.txt."""
    print_color("\n4. Installing Python backend dependencies...", "bold")
    if not os.path.exists(REQUIREMENTS_FILE):
        print_color(f"  [✗] '{REQUIREMENTS_FILE}' not found.", "red")
        return False

    print(f"  Running: pip install -r {REQUIREMENTS_FILE}")
    if run_command(f"{sys.executable} -m pip install -r {REQUIREMENTS_FILE}"):
        print_color("  [✓] Python dependencies installed successfully.", "green")
        return True
    else:
        print_color("  [✗] Failed to install Python dependencies.", "red")
        return False

def install_node_dependencies():
    """Installs Node.js dependencies using npm."""
    print_color("\n5. Installing Node.js frontend dependencies...", "bold")
    if not os.path.exists("package.json"):
        print_color("  [!] 'package.json' not found. Skipping frontend dependency installation.", "yellow")
        return True # Not a failure, just a skip

    print("  Running: npm install (this may take a moment)...")
    if run_command("npm install"):
        print_color("  [✓] Node.js dependencies installed successfully.", "green")
        return True
    else:
        print_color("  [✗] Failed to install Node.js dependencies. Try running 'npm install' manually.", "red")
        return False

def check_container_tools():
    """Checks for Docker and kubectl."""
    print_color("\n6. Checking container tools (Docker & kubectl)...", "bold")
    docker_exists = check_command("docker")
    kubectl_exists = check_command("kubectl")
    
    if docker_exists:
        print_color("  [✓] Docker is installed.", "green")
    else:
        print_color("  [!] Docker is not installed. Required for building images.", "yellow")
        
    if kubectl_exists:
        print_color("  [✓] kubectl is installed.", "green")
    else:
        print_color("  [!] kubectl is not installed. Required for deployment.", "yellow")
    
    return docker_exists and kubectl_exists

def main():
    """Main setup script execution."""
    print_color("--- Starting Project Setup ---", "bold")
    
    steps = [
        check_python_version,
        check_node_version,
        setup_environment_file,
        install_python_dependencies,
        install_node_dependencies,
        check_container_tools
    ]
    
    all_successful = all(step() for step in steps)
    
    print_color("\n--- Setup Complete ---", "bold")
    if all_successful:
        print_color("All automated setup steps completed successfully.", "green")
        print("\nNext Steps:")
        print(" 1. Edit the 'api/.env' file with your API keys (SERPAPI_KEY is required).")
        print(" 2. Set up your Firebase project and place the service account key JSON file in the root directory.")
        print(" 3. To start the development servers, run:")
        print_color("    - Backend:  python api/index.py", "bold")
        print_color("    - Frontend: npm run dev", "bold")
    else:
        print_color("Some setup steps failed. Please review the errors above and address them manually.", "red")
        sys.exit(1)

if __name__ == "__main__":
    main()