<?php

function handle_multipart_request()
{
        // Extract the form data (excluding files) using the $_POST superglobal and save it to the $data array
        $data = $_POST;

        // Check if files are included in the request
        if (!empty($_FILES)) {
            $data['files'] = $_FILES; // Save the files to the 'files' key in the $data array
        }

        // Return the combined data, including both form data and uploaded files
        return $data;
}
