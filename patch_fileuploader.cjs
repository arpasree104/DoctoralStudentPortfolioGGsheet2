const fs = require('fs');
const content = fs.readFileSync('src/components/FileUploader.tsx', 'utf8');

const targetList = `      {/* Uploaded File List */}
      {safeFiles.length > 0 && (
        <div className="space-y-1.5 pt-1">
          {safeFiles.map((file, idx) => (
            <div key={idx} className="flex items-center justify-between p-2.5 bg-white border border-gray-100 rounded-lg shadow-xs group">
              <div className="flex items-center gap-2 overflow-hidden">
                <FileText size={14} className="text-tu-red shrink-0" />
                <span className="text-xs text-gray-700 font-medium truncate" title={file.name}>
                  {file.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                <a 
                  href={file.url}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-1 text-gray-400 hover:text-blue-500 rounded hover:bg-blue-50 transition"
                  title="Open file"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={14} />
                </a>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(idx);
                  }}
                  className="p-1 text-gray-400 hover:text-red-500 rounded hover:bg-red-50 transition"
                  title="Remove file"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}`;

const targetZone = `      {/* Upload Zone */}
      <div 
        onClick={triggerFileInput}
        className={\`border border-dashed border-gray-300 hover:border-tu-red/60 rounded-xl bg-gray-50/50 p-4 transition duration-200 cursor-pointer text-center flex flex-col items-center justify-center space-y-1.5 \${
          isUploading ? 'pointer-events-none opacity-80' : ''
        }\`}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple 
          accept={accept} 
          className="hidden" 
        />
        {isUploading ? (
          <>
            <Loader2 size={18} className="animate-spin text-tu-red" />
            <span className="text-xs font-semibold text-gray-600">Uploading attachment to Google Drive...</span>
            <span className="text-[10px] text-gray-400 leading-none">Saving into student folder on your Drive</span>
          </>
        ) : (
          <>
            <Upload size={18} className="text-gray-400" />
            <span className="text-xs font-semibold text-gray-700">Attach file (Click or Drag & Drop)</span>
            <span className="text-[10px] text-gray-400 leading-none">Supports PDF, Word, Excel, Images (Max {maxFiles} files)</span>
          </>
        )}
      </div>

      {error && (
        <div className="text-[10px] text-red-500 font-semibold bg-red-50 p-2 rounded-lg flex items-center gap-1">
          <AlertCircle size={12} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}`;


const newContent = content.replace(targetZone, "").replace(targetList, targetList + "\n\n" + targetZone);
fs.writeFileSync('src/components/FileUploader.tsx', newContent);
console.log("Done");
