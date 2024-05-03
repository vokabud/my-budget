import { CloudUpload, UploadFile } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { FC, useState, useRef } from "react";

interface IProps {
    onFileContent: (content: string) => void;
}

const FileLoader: FC<IProps> = ({
    onFileContent
}) => {
    const [name, setName] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = () => {
        const file = fileInputRef.current?.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                onFileContent(content);
                setName(file.name);
            };
            reader.readAsText(file);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
            <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUpload />}
                onClick={handleButtonClick}
            >
                Choose File
            </Button>
            <Typography ml={'20px'} variant="body1" component="p">{name}</Typography>
        </>
    );
};

export default FileLoader;
