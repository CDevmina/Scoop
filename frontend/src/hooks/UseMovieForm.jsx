import { useState } from 'react';
import { initialFormState } from '../constants/formInitialState';

export const useMovieForm = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [tallBannerPreview, setTallBannerPreview] = useState(null);
  const [wideBannerPreview, setWideBannerPreview] = useState(null);
  const [activeTab, setActiveTab] = useState(1);

  const resetForm = () => {
    setFormData(initialFormState);
    setTallBannerPreview(null);
    setWideBannerPreview(null);
  };

  return {
    formData,
    setFormData,
    tallBannerPreview,
    setTallBannerPreview,
    wideBannerPreview,
    setWideBannerPreview,
    activeTab,
    setActiveTab,
    resetForm
  };
};