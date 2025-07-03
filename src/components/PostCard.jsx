import { useState } from "react";

const PostCard = ({ post, showActions, onEdit, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete();
    setIsDeleting(false);
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-md transition h-full flex flex-col">
      <div className="p-4 flex-grow">
        <h3 className="font-bold text-xl mb-2">{post.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
      </div>
      {showActions && (
        <div className="p-4 border-t flex justify-end space-x-2">
          <button 
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded hover:bg-blue-50"
            disabled={isDeleting}
          >
            Edit
          </button>
          <button 
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 px-3 py-1 rounded hover:bg-red-50"
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PostCard