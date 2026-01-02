        setup_environment_file,
        install_python_dependencies,
        install_node_dependencies,
        check_container_tools,
        build_docker_image
    ]
    
        print(" 1. Edit the 'api/.env' file with your API keys (SERPAPI_KEY is required).")
        print(" 2. Set up your Firebase project and place the service account key JSON file in the root directory.")
        print(" 3. To start the development servers, run:")
        print_color("    - Backend:  python3 api/index.py", "bold")
        print_color("    - Frontend: npm run dev", "bold")
    else:
        print_color("Some setup steps failed. Please review the errors above and address them manually.", "red")
