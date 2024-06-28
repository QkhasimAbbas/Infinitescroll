import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ImageComponent from './ImageComponent';
const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;


const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const UNSPLASH_ACCESS_KEY = accessKey;  

  const fetchImages = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.unsplash.com/photos`, {
        params: { page, per_page: 10 },
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
        }
      });
      setImages((prevImages) => [...prevImages, ...response.data]);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchImages(page);
  }, [page]);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.scrollHeight - 500 && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="image-gallery">
      {images.map((image, index) => (
        <ImageComponent key={index} src={image.urls.small} alt={image.alt_description} />
      ))}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default ImageGallery;

