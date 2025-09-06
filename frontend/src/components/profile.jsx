import Navbar from "./shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact, Mail, Pen } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import AppliedJobTable from "./AppliedJobTable";
import { useState } from "react";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { shallowEqual, useSelector } from "react-redux";
import useGetAppliedJobs from "../hooks/useGetAppliedJobs";
import { motion } from "framer-motion";

const DEFAULT_AVATAR =
  "https://static.vecteezy.com/system/resources/previews/032/176/191/non_2x/business-avatar-profile-black-icon-man-of-user-symbol-in-trendy-flat-style-isolated-on-male-profile-people-diverse-face-for-social-network-or-web-vector.jpg";

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);

  const user = useSelector((store) => store.auth.user, shallowEqual);
  const { profile } = user || {};
  const isResume = !!profile?.resume;

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading profile...
      </div>
    );
  }

      return (
        <div>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] via-[#dbeafe] to-[#e0f7ff] py-10">

      {/* Profile Info */}
      <motion.div
        className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Profile Header */}
        <div className="flex justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ rotateY: 15, rotateX: 5, scale: 1.05 }}
              className="h-24 w-24"
            >
              <Avatar className="h-24 w-24 shadow-lg">
                <AvatarImage
                  src={profile?.profilePhoto || DEFAULT_AVATAR}
                  alt="User Avatar"
                />
              </Avatar>
            </motion.div>
            <div>
              <h1 className="font-medium text-xl">{user?.fullname || "Unknown User"}</h1>
              <p className="text-gray-600">{profile?.bio || "No bio available"}</p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.05, rotate: 3 }}>
            <Button variant="outline" onClick={() => setOpen(true)}>
              <Pen />
            </Button>
          </motion.div>
        </div>

        {/* Contact Info */}
        <div className="my-5 space-y-2">
          <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3">
            <Mail className="text-blue-600" />
            <span>{user?.email || "No email provided"}</span>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} className="flex items-center gap-3">
            <Contact className="text-green-600" />
            <span>{user?.phoneNumber || "No phone number provided"}</span>
          </motion.div>
        </div>

        {/* Skills */}
        <div>
          <h1 className="font-bold mb-2">Skills</h1>
          {profile?.skills?.length ? (
            profile.skills.map((skill, index) => (
              <motion.div key={index} whileHover={{ scale: 1.05, rotateZ: 2 }} className="inline-block mr-2 mb-2">
                <Badge className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-white font-semibold">
                  {skill}
                </Badge>
              </motion.div>
            ))
          ) : (
            <span className="text-gray-500">No skills added</span>
          )}
        </div>

        {/* Resume */}
        <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
          <Label className="text-md font-bold">Resume</Label>
          {isResume ? (
            <motion.a
              whileHover={{ scale: 1.05, color: "#3B82F6" }}
              target="_blank"
              rel="noopener noreferrer"
              href={profile.resume}
              className="text-blue-500 underline"
            >
              📄 {profile.resumeOriginalName || "View Resume"}
            </motion.a>
          ) : (
            <span className="text-gray-500 italic">No resume uploaded</span>
          )}
        </div>
      </motion.div>

      {/* Applied Jobs */}
      <motion.div
        className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-2xl font-semibold mb-4">Applied Jobs</h1>
        <AppliedJobTable />
      </motion.div>

      {/* Update Profile Dialog */}
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
    </div>
  );
};

export default Profile;
