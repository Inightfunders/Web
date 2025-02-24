import React from 'react';

import { cn } from '@/lib/utils';

interface Props {
  className?: string;
  fileType: 'image' | 'video';
  fileUrl?: string | null;
  onChange: (file: File) => void;
  children: React.ReactNode;
}

export const UploadForm: React.FC<Props> = ({
  className = '',
  fileType,
  fileUrl,
  onChange = () => true,
  children
}) => {
  const inputRef = React.useRef(null);

  const [dragActive, setDragActive] = React.useState(false);
  const [image, setImage] = React.useState<string | null>(null);
  const [progress, setProgress] = React.useState(0);
  const [isUploading, setUploading] = React.useState(false);

  // handle drag events
  function handleDrag(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === 'dragenter' || event.type === 'dragover') {
      setDragActive(true);
    } else if (event.type === 'dragleave') {
      setDragActive(false);
    }
  }

  // triggers when file is dropped
  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      handleFile(event.dataTransfer.files);
    }
  }

  // triggers when file is selected with click
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault();
    if (event.target.files && event.target.files[0]) {
      handleFile(event.target.files);
    }
  }

  async function handleFile(files: FileList) {
    const file = files[0];
    if (file) {
      const fileSize = file.size / 1024 / 1024; // Convert size to MB

      // Check if the file is of valid type (JPG, PNG) and under 1MB
      if (
        fileSize <= 1 &&
        (file.type === 'image/jpeg' || file.type === 'image/png')
      ) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      }

      onChange(file);
    }
  }

  return (
    <div
      className={cn(
        'upload-form',
        'relative cursor-pointer',
        dragActive ? 'opacity-50' : ''
      )}
      onDragEnter={(event) => handleDrag(event)}
    >
      <label className={cn('', className)} htmlFor="input-file-upload">
        <input
          ref={inputRef}
          id="input-file-upload"
          className="hidden"
          type="file"
          accept={
            fileType
              ? fileType === 'image'
                ? 'image/png, image/gif, image/jpeg'
                : 'video/*'
              : 'image/*, video/*'
          }
          onChange={(event) => handleChange(event)}
        />
        {children}
      </label>
      {dragActive && (
        <div
          id="drag-file-element"
          className={cn(
            'absolute bottom-0 left-0 right-0 top-0 h-full w-full rounded'
          )}
          onDragEnter={(event) => handleDrag(event)}
          onDragLeave={(event) => handleDrag(event)}
          onDragOver={(event) => handleDrag(event)}
          onDrop={(event) => handleDrop(event)}
        />
      )}
    </div>
  );
};
