import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../firebase";

interface UploadImageProps {
    onSuccess: () => void; 
}

const UploadImage: React.FC<UploadImageProps> = ({ onSuccess }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
        }
    };

    const uploadImage = async () => {
        if (!imageFile) return;
        setUploading(true);
        try {
            const storageRef = ref(storage, `banners/${imageFile.name}`);
            await uploadBytes(storageRef, imageFile);
            const url = await getDownloadURL(storageRef);

            await addDoc(collection(db, "banners_school"), { imageUrl: url });
            setImageUrl(url);
            alert("อัปโหลดรูปภาพสำเร็จ!");

            // เรียกใช้ onSuccess เพื่อโหลดข้อมูลรูปภาพใหม่
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการอัปโหลด:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleImageChange} />
            <button onClick={uploadImage} disabled={!imageFile || uploading}>
                {uploading ? "กำลังอัปโหลด..." : "อัปโหลดรูปภาพ"}
            </button>
        </div>
    );
};

export default UploadImage;
