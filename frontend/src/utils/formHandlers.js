export const useFormHandlers = (formData, setFormData, setTallBannerPreview, setWideBannerPreview) => {
    const handleChange = (event) => {
      const { name, value } = event.target;
      if (name === "adultPrice" || name === "kidPrice") {
        const regex = /^\d*(\.\d{0,2})?$/;
        if (!regex.test(value)) return;
      }
      setFormData({ ...formData, [name]: value });
    };
  
    const handleFileChange = (event, bannerType) => {
      const file = event.target.files[0];
      if (file) {
        setFormData({ ...formData, [bannerType]: file });
        const reader = new FileReader();
        reader.onloadend = () => {
          if (bannerType === "tallBanner") {
            setTallBannerPreview(reader.result);
          } else if (bannerType === "wideBanner") {
            setWideBannerPreview(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    };
  
    const handleTheaterChange = (selectedTheater) => {
      setFormData((prev) => ({ ...prev, theaters: selectedTheater, auditorium: "" }));
    };
  
    const handleAuditoriumChange = (selectedAuditorium) => {
      setFormData((prev) => ({ ...prev, auditorium: selectedAuditorium }));
    };
  
    const handleAddTimeSlot = () => {
      setFormData({
        ...formData,
        timeSlots: [...formData.timeSlots, { startTime: null, endTime: null }],
      });
    };
  
    const handleTimeChange = (index, field, time) => {
      const updatedTimeSlots = [...formData.timeSlots];
      updatedTimeSlots[index][field] = time;
      setFormData({ ...formData, timeSlots: updatedTimeSlots });
    };
  
    const handleDeleteTimeSlot = (index) => {
      const updatedTimeSlots = formData.timeSlots.filter((_, idx) => idx !== index);
      setFormData({ ...formData, timeSlots: updatedTimeSlots });
    };
  
    const handleDateChange = (date, field) => {
      setFormData((prev) => ({ ...prev, [field]: date }));
      console.log(date);
    };
  
    const handleAddPerson = (field) => {
      setFormData({
        ...formData,
        [field]: [...formData[field], ""],
      });
    };
  
    const handleRemovePerson = (field, index) => {
      const updatedList = formData[field].filter((_, idx) => idx !== index);
      setFormData({ ...formData, [field]: updatedList });
    };
  
    const handlePersonChange = (field, index, value) => {
      const updatedList = [...formData[field]];
      updatedList[index] = value;
      setFormData({ ...formData, [field]: updatedList });
    };
  
    return {
      handleChange,
      handleFileChange,
      handleTheaterChange,
      handleAuditoriumChange,
      handleAddTimeSlot,
      handleTimeChange,
      handleDeleteTimeSlot,
      handleDateChange,
      handleAddPerson,
      handleRemovePerson,
      handlePersonChange
    };
  };