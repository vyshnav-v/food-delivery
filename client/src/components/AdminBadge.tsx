import { Shield } from "lucide-react";

const AdminBadge = () => {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
      <Shield size={12} />
      ADMIN
    </span>
  );
};

export default AdminBadge;
