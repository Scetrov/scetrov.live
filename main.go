package main

import (
	"log"
	"net/http"
)

func main() {
	// The directory you want to serve ( "." is the current folder )
	directory := "."
	port := ":8080"

	log.Printf("Serving %s on http://localhost%s\n", directory, port)
	
	// Create a file server handler
	fs := http.FileServer(http.Dir(directory))
	
	// Set the root route to use that file server
	http.Handle("/", fs)

	// Start the server
	err := http.ListenAndServe(port, nil)
	if err != nil {
		log.Fatal(err)
	}
}