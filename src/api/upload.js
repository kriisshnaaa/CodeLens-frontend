export async function uploadCodebase(file){
  const formData=new FormData();
  formData.append("codebase",file);

  const res=await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {

    method:"POST",
    body:formData
  });

  return res.json();
}
