import { useState, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const Profile = () => {
  const { user, setCurrentRole } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [preview, setPreview] = useState(user?.imageUrl || "");
  const [profileFile, setProfileFile] = useState<File | null>(null);

  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview("");
    setProfileFile(null);
  };

  const handleSave = () => {
    // Normally, save to DB. Here, localStorage for demo.
    const storedUsers = localStorage.getItem("medishare_users");
    if (storedUsers && user) {
      let users = JSON.parse(storedUsers);
      const idx = users.findIndex((u: any) => u.id === user.id);
      if (idx !== -1) {
        users[idx].name = name;
        users[idx].imageUrl = preview || "";
        localStorage.setItem("medishare_users", JSON.stringify(users));
      }
    }
    // Sync for current session
    if (user) {
      user.name = name;
      user.imageUrl = preview || "";
    }
    setCurrentRole(user?.role);
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-2">
              <Avatar className="w-24 h-24 mb-2">
                {preview ? (
                  <AvatarImage src={preview} alt="Profile" />
                ) : (
                  <AvatarFallback>
                    <span className="text-3xl">👤</span>
                  </AvatarFallback>
                )}
              </Avatar>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {preview && (
                <Button variant="outline" size="sm" onClick={handleRemoveImage}>
                  Remove Image
                </Button>
              )}
            </div>
            <div>
              <Label>Your Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2"
              />
            </div>
            <Button onClick={handleSave} className="w-full">
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
