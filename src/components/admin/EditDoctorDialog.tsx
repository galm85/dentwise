import { useUpdateDoctor } from "@/hooks/use-doctors";
import { formatPhoneNumber } from "@/lib/utils";
import { Doctor, Gender } from "@prisma/client";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";

interface EditDoctorDialogProps{
    isOpen:boolean;
    onClose:()=>void;
    doctor:Doctor | null;
}

function EditDoctorDialog({isOpen,onClose,doctor}:EditDoctorDialogProps) {

   const [editingDoctor,setEditingDoctor] = useState<Doctor | null>(doctor);
   
   const updateDoctorMutation = useUpdateDoctor();

   const handlePhoneChange = (value:string)=>{
       const formattedNumber = formatPhoneNumber(value);
       if(editingDoctor){
           setEditingDoctor({...editingDoctor,phone:formattedNumber});
       }
   }

    const handleSave = ()=>{
        if(editingDoctor){
            updateDoctorMutation.mutate({...editingDoctor},{onSuccess:handleClose})
        }
    }

    const handleClose = ()=>{
        onClose();
        setEditingDoctor(null);
    }
   
   
  return (
     <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-125">
    
            <DialogHeader>
              <DialogTitle>Edit Doctor</DialogTitle>
              <DialogDescription>Update doctor information and status.</DialogDescription>
            </DialogHeader>
    
            {editingDoctor && (
                <>
                <div className="grid gap-4 py-4">
        
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-name">Name *</Label>
                            <Input id="new-name" 
                                value={editingDoctor.name} 
                                onChange={(e)=>setEditingDoctor({...editingDoctor,name:e.target.value})} 
                                placeholder="Dr. John Smith"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-speciality">Speciality *</Label>
                            <Input
                                id="new-speciality"
                                value={editingDoctor.speciality}
                                onChange={(e) => setEditingDoctor({ ...editingDoctor, speciality: e.target.value })}
                                placeholder="General Dentistry"
                            />
                        </div>
                    </div>
        
                    <div className="space-y-2">
                        <Label htmlFor="new-email">Email *</Label>
                        <Input
                        id="new-email"
                        type="email"
                        value={editingDoctor.email}
                        onChange={(e) => setEditingDoctor({ ...editingDoctor, email: e.target.value })}
                        placeholder="doctor@example.com"
                        />
                    </div>
        
                    <div className="space-y-2">
                        <Label htmlFor="new-phone">Phone</Label>
                        <Input
                        id="new-phone"
                        value={editingDoctor.phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="(555) 123-4567"
                        />
                    </div>
        
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-gender">Gender</Label>
                            <Select
                                value={editingDoctor.gender || ""}
                                onValueChange={(value) => setEditingDoctor({ ...editingDoctor, gender: value as Gender })}
                            >
                                <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="MALE">Male</SelectItem>
                                <SelectItem value="FEMALE">Female</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
        
                        <div className="space-y-2">
                            <Label htmlFor="new-status">Status</Label>
                            <Select
                                value={editingDoctor.isActive ? "active" : "inactive"}
                                onValueChange={(value) =>
                                setEditingDoctor({ ...editingDoctor, isActive: value === "active" })
                                }
                            >
                                <SelectTrigger>
                                <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
        
                </div>
        
                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>Cancel</Button>
        
                    <Button
                        onClick={handleSave}
                        className="bg-primary hover:bg-primary/90"
                        disabled={
                        !editingDoctor.name ||
                        !editingDoctor.email ||
                        !editingDoctor.speciality ||
                        updateDoctorMutation.isPending
                        }
                    >
                    {updateDoctorMutation.isPending ? "updating..." : "Update Doctor"}
                    </Button>
                </DialogFooter>
                </>
            )}
        </DialogContent>
       </Dialog>
  )
}

export default EditDoctorDialog