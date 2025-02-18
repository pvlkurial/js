import { useState } from "react";

export default function UploadCSV() {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("http://localhost:5000/upload-csv", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        alert(JSON.stringify(data, null, 2));
    };

    return (
        <div>
            <input type="file" accept=".csv" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
}
