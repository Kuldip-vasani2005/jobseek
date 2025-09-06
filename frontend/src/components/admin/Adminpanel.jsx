import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  FiUsers, FiBriefcase, FiFileText, FiSearch, FiEye, FiEdit2, FiTrash2, FiX, FiUser, FiSave 
} from "react-icons/fi";
import UniqueAlert from "./UniqueAlert";

// Utility function to format values
const formatValue = (value) => {
  if (!value) return "";
  if (typeof value === "object") {
    if (value.name) return value.name;
    if (value.title) return value.title;
    if (value.email) return value.email;
    if (Array.isArray(value)) return value.map(formatValue).join(", ");
    return JSON.stringify(value);
  }
  return String(value);
};

// Edit Modal
const EditModal = ({ show, item, formData, setFormData, onClose, onSave }) => {
  const handleChange = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));
  return (
    <AnimatePresence>
      {show && item && (
        <motion.div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="bg-gradient-to-br from-indigo-800 via-purple-700 to-pink-700 rounded-3xl p-8 w-full max-w-lg border border-white/20 backdrop-blur-xl shadow-2xl"
            initial={{ scale: 0.7, rotateX: 30 }} animate={{ scale: 1, rotateX: 0 }} exit={{ scale: 0.7, rotateX: 30 }} transition={{ type: "spring", stiffness: 120 }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-yellow-300">Edit Item</h2>
              <button onClick={onClose} className="text-gray-300 hover:text-white"><FiX size={22} /></button>
            </div>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {Object.entries(item).map(([key, val]) =>
                ["_id","__v","password"].includes(key)?null:(
                  <div key={key}>
                    <label className="block text-white/80 capitalize mb-1">{key}</label>
                    <input 
                      type="text" 
                      value={formData[key] || ""} 
                      onChange={e => handleChange(key, e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all" 
                    />
                  </div>
                )
              )}
            </div>
            <div className="flex justify-end mt-6 gap-3">
              <button onClick={onClose} className="px-4 py-2 rounded-xl text-white bg-gray-500/60 hover:bg-gray-600/70 transition-all">Cancel</button>
              <motion.button whileHover={{ scale: 1.05 }} onClick={onSave} className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-xl text-white shadow-lg shadow-green-500/40">
                <FiSave /> Save
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// View Modal
const ViewModal = ({ show, item, onClose }) => (
  <AnimatePresence>
    {show && item && (
      <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <motion.div className="bg-gradient-to-br from-indigo-800 via-purple-700 to-pink-700 rounded-3xl p-8 w-full max-w-lg border border-white/20 backdrop-blur-xl shadow-2xl"
          initial={{ scale: 0.7, rotateX: 30 }} animate={{ scale: 1, rotateX: 0 }} exit={{ scale: 0.7, rotateX: 30 }} transition={{ type: "spring", stiffness: 120 }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-yellow-300">Details</h2>
            <button onClick={onClose} className="text-gray-300 hover:text-white"><FiX size={22} /></button>
          </div>
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {Object.entries(item).map(([key, val]) =>
              ["_id","__v","password"].includes(key)?null:(
                <p key={key}><span className="font-semibold capitalize text-white/80">{key}:</span> <span className="text-white">{formatValue(val)}</span></p>
              )
            )}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const Adminpanel = () => {
  const navigate = useNavigate(); // navigation hook
  const [tab,setTab] = useState("users");
  const [data,setData] = useState([]);
  const [loading,setLoading] = useState(false);
  const [selectedItem,setSelectedItem] = useState(null);
  const [showModal,setShowModal] = useState(false);
  const [editMode,setEditMode] = useState(false);
  const [formData,setFormData] = useState({});
  const [alert,setAlert] = useState(null);

  const fetchData = async (endpoint) => {
    if(endpoint==="dashboard") return;
    try{
      setLoading(true);
      const res = await axios.get(`http://localhost:8000/api/v1/adminpanel/${endpoint}`,{ withCredentials:true });
      setData(res.data.data||[]);
    }catch(err){
      console.error(err);
      setAlert({ type:"error", message: err.response?.data?.message || "Failed to fetch data"});
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{ fetchData(tab); },[tab]);

  const openModal = (item,isEdit=false)=>{
    setSelectedItem(item); setEditMode(isEdit); setFormData(item); setShowModal(true);
  };
  const handleUpdate = async ()=>{
    try{
      const res = await axios.put(`http://localhost:8000/api/v1/adminpanel/${tab}/${selectedItem._id}`, formData, { withCredentials:true });
      setData(prev=> prev.map(i=>i._id===selectedItem._id?res.data.data:i));
      setAlert({ type:"success", message:"Updated successfully"});
      setShowModal(false);
    }catch(err){ console.error(err); setAlert({ type:"error", message:"Failed to update"}); }
  };
  const handleDelete = async (id)=>{
    try{
      await axios.delete(`http://localhost:8000/api/v1/adminpanel/${tab}/${id}`, { withCredentials:true });
      setData(prev=> prev.filter(i=>i._id!==id));
      setAlert({ type:"success", message:"Deleted successfully" });
    }catch(err){ console.error(err); setAlert({ type:"error", message:"Failed to delete"}); }
  };

  const handleLogout = async () => {
    try {
      // await axios.post("http://localhost:5173/", {}, { withCredentials: true });
      navigate("/"); // redirect to home
    } catch (err) {
      console.error("Logout failed:", err);
      setAlert({ type: "error", message: "Logout failed" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/10 border-b border-white/20 shadow-lg shadow-black/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-yellow-300 drop-shadow-lg">Admin Panel</h1>
          <div className="flex gap-4">
            {[
              {key:"users", icon:<FiUsers />, label:"Users"},
              {key:"companies", icon:<FiBriefcase />, label:"Companies"},
              {key:"jobs", icon:<FiFileText />, label:"Jobs"},
              {key:"applications", icon:<FiSearch />, label:"Applications"},
            ].map(({key, icon, label})=>(
              <motion.button key={key} whileHover={{scale:1.1}} whileTap={{scale:0.95}} onClick={()=>setTab(key)}
                className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1 ${tab===key?"bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 text-black shadow-lg shadow-yellow-500/40":"hover:bg-white/20 hover:backdrop-blur-sm"}`}>
                {icon} <span>{label}</span>
              </motion.button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2"><FiUser /> <span>Admin</span></div>
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout} 
              className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all shadow-md"
            >
              Logout
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="pt-28 px-6">
        {alert && <UniqueAlert type={alert.type} message={alert.message} onClose={()=>setAlert(null)} />}
        {loading ? <p className="text-center text-lg animate-pulse">Loading...</p> :
        data.length ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {data.map(item=>(
              <motion.div key={item._id} whileHover={{scale:1.05, rotateY:5}}
                className="rounded-3xl backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/20 shadow-2xl p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-yellow-400/40">
                <div>
                  {Object.entries(item).map(([key,val])=>["_id","__v","password"].includes(key)?null:
                    <p key={key} className="mb-1 break-words"><span className="font-semibold capitalize text-white/80">{key}:</span> <span className="text-white">{formatValue(val)}</span></p>
                  )}
                </div>
                <div className="flex justify-end gap-3 mt-4">
                  <motion.button whileHover={{scale:1.2, rotateZ:5}} onClick={()=>openModal(item,false)} className="text-blue-400 hover:text-blue-500 hover:shadow-lg hover:shadow-blue-500/40"><FiEye/></motion.button>
                  <motion.button whileHover={{scale:1.2, rotateZ:5}} onClick={()=>openModal(item,true)} className="text-green-400 hover:text-green-500 hover:shadow-lg hover:shadow-green-500/40"><FiEdit2/></motion.button>
                  <motion.button whileHover={{scale:1.2, rotateZ:5}} onClick={()=>handleDelete(item._id)} className="text-red-400 hover:text-red-500 hover:shadow-lg hover:shadow-red-500/40"><FiTrash2/></motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        ) : <p className="text-center text-lg">No {tab} found.</p>}
      </div>

      <EditModal show={showModal && editMode} item={selectedItem} formData={formData} setFormData={setFormData} onClose={()=>setShowModal(false)} onSave={handleUpdate} />
      <ViewModal show={showModal && !editMode} item={selectedItem} onClose={()=>setShowModal(false)} />
    </div>
  );
};

export default Adminpanel;