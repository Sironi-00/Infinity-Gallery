import { useContext, useState } from "react";
import { uploadImage } from "../../Api/Api";
import { useNavigate } from "react-router-dom";

import { AppContext } from '../../ContextProvider/ContextProvider'

export default function UploadModal() {
    const navigate = useNavigate();
    
    const { currentUser } = useContext(AppContext);

    const [imageObject, setImageObject] = useState({
        name: "",
        description: "",
        file: null
    });

    const closeDialog = ({target}) => {
        if (target.id === "upload-modal") {
            target.close();
        }
    };

    const handleImageUpload = async (e) => {
        e.preventDefault();
        
        if (!currentUser || !currentUser.name) {
            return
        }
        const res = await uploadImage({...imageObject, author: currentUser.id});
        
        if (res) {
            document.getElementById("upload-modal").close()
            navigate(`/image/${res.id}`);
            setImageObject({
                name: "",
                description: "",
            });
        } else {
            console.log("Failed to upload")
        }
    }

    return (
        <dialog id="upload-modal" className="modal" onClick={closeDialog} >
            <div className="dialog-body">
                <h2>Upload Image</h2>
                {currentUser?.name && <p>Artist: <strong>{currentUser.name}</strong></p>}
                <form onSubmit={handleImageUpload}>
                    <input type="text" placeholder="Name" value={imageObject.name} onChange={({target}) => setImageObject(prev => ({...prev, name: target.value}))} minLength="3" autoFocus />
                    <br />
                    <textarea name="description" cols="30" rows="10" placeholder="Image description" value={imageObject.description} onChange={({target}) => setImageObject(prev => ({...prev, description: target.value}))} minLength="3"></textarea>
                    <br />
                    <input id="file-uploader" name="image" type="file" accept="image/*" onChange={({target}) => setImageObject(prev => ({...prev, file: target.files[0]}))} required />
                    {
                        imageObject.file && <img className="img-sm" src={URL.createObjectURL(imageObject.file)} alt={"Image: " + imageObject.name} />
                    }
                    <br />
                    { imageObject.name.length > 0 && <input type="submit" value="Submit" /> }
                </form>
                <form method="dialog">
                    <button>Close</button>
                </form>
            </div>
        </dialog>
    );
}
