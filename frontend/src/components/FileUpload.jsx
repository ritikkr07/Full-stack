import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { UploadCloud, File, X, Image as ImageIcon, Video, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedData, setUploadedData] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Create preview URL
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview({
        url: objectUrl,
        type: selectedFile.type.startsWith('video/') ? 'video' : 'image'
      });
      setUploadedData(null); // Reset previously uploaded data
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.webm', '.ogg']
    },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setUploadedData(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        withCredentials: true,
      });
      toast.success('File uploaded successfully!');
      setUploadedData(response.data.data);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container" style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
      <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <UploadCloud size={20} /> Upload Media
      </h2>
      
      {!file && (
        <div 
          {...getRootProps()} 
          style={{
            border: `2px dashed ${isDragActive ? 'var(--primary-color)' : 'var(--border-color)'}`,
            borderRadius: '8px',
            padding: '3rem 1rem',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: isDragActive ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
            transition: 'all 0.2s ease'
          }}
        >
          <input {...getInputProps()} />
          <UploadCloud size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem', opacity: 0.7 }} />
          {isDragActive ? (
            <p style={{ color: 'var(--primary-color)', fontWeight: 500 }}>Drop the files here ...</p>
          ) : (
            <div>
              <p style={{ marginBottom: '0.5rem', fontWeight: 500 }}>Drag & drop an image or video here, or click to select</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Supports JPG, PNG, GIF, MP4, WEBM (Max 100MB)</p>
            </div>
          )}
        </div>
      )}

      {file && !uploadedData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {preview?.type === 'video' ? <Video size={24} color="var(--primary-color)" /> : <ImageIcon size={24} color="var(--primary-color)" />}
              <div>
                <p style={{ fontWeight: 500, fontSize: '0.9rem', wordBreak: 'break-all' }}>{file.name}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
            <button onClick={removeFile} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }} disabled={uploading}>
              <X size={20} />
            </button>
          </div>

          {preview && (
            <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)', maxHeight: '300px', display: 'flex', justifyContent: 'center', backgroundColor: '#000' }}>
              {preview.type === 'video' ? (
                <video src={preview.url} controls style={{ maxHeight: '300px', maxWidth: '100%' }} />
              ) : (
                <img src={preview.url} alt="Preview" style={{ maxHeight: '300px', maxWidth: '100%', objectFit: 'contain' }} />
              )}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button onClick={removeFile} className="btn-outline" disabled={uploading}>
              Cancel
            </button>
            <button onClick={handleUpload} className="btn-primary" disabled={uploading} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {uploading ? <><Loader2 size={16} className="animate-spin" /> Uploading...</> : 'Upload to Cloudinary'}
            </button>
          </div>
        </div>
      )}

      {uploadedData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '8px', color: '#10b981' }}>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
              <File size={18} /> Successfully uploaded to Cloudinary
            </p>
          </div>
          
          <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)', maxHeight: '400px', display: 'flex', justifyContent: 'center', backgroundColor: '#000' }}>
            {uploadedData.resource_type === 'video' ? (
              <video src={uploadedData.url} controls style={{ maxHeight: '400px', maxWidth: '100%' }} />
            ) : (
              <img src={uploadedData.url} alt="Uploaded" style={{ maxHeight: '400px', maxWidth: '100%', objectFit: 'contain' }} />
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)' }}>Secure URL:</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
               <input type="text" value={uploadedData.url} readOnly style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
               <button onClick={() => { navigator.clipboard.writeText(uploadedData.url); toast.success('Copied to clipboard'); }} className="btn-outline">Copy</button>
            </div>
          </div>

          <button onClick={removeFile} className="btn-primary" style={{ alignSelf: 'flex-start' }}>
            Upload Another File
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
