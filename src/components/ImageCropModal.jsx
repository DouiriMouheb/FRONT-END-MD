import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { RotateCw, ZoomIn, ZoomOut, Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ImageCropModal = ({ image, onCropComplete, onCancel }) => {
  const { t } = useTranslation();
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (newCrop) => {
    setCrop(newCrop);
  };

  const onZoomChange = (newZoom) => {
    setZoom(newZoom);
  };

  const onRotationChange = (newRotation) => {
    setRotation(newRotation);
  };

  const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    canvas.width = safeArea;
    canvas.height = safeArea;

    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-safeArea / 2, -safeArea / 2);

    ctx.drawImage(
      image,
      safeArea / 2 - image.width * 0.5,
      safeArea / 2 - image.height * 0.5
    );

    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.putImageData(
      data,
      Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
      Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.95);
    });
  };

  const handleSave = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(image, croppedAreaPixels, rotation);
      const croppedImageUrl = URL.createObjectURL(croppedImageBlob);
      
      // Create a File object from the blob
      const file = new File([croppedImageBlob], 'profile-picture.jpg', { type: 'image/jpeg' });
      
      onCropComplete(croppedImageUrl, file);
    } catch (e) {
      console.error('Error cropping image:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-4xl mx-4"
        style={{ background: 'hsl(var(--panel))' }}
      >
        <div className="border border-border rounded-lg overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">{t('profile.profilePicture.crop')}</h2>
            <button
              onClick={onCancel}
              className="btn btn-ghost p-2"
              title={t('profile.actions.cancel')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cropper Area */}
          <div className="relative" style={{ height: '500px', background: 'hsl(var(--bg))' }}>
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={onCropChange}
              onZoomChange={onZoomChange}
              onRotationChange={onRotationChange}
              onCropComplete={onCropCompleteCallback}
            />
          </div>

          {/* Controls */}
          <div className="p-6 border-t border-border space-y-4">
            {/* Zoom Control */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <ZoomIn className="w-4 h-4" />
                  {t('profile.crop.zoom')}
                </label>
                <span className="text-xs text-subtle">{Math.round(zoom * 100)}%</span>
              </div>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, hsl(var(--accent)) 0%, hsl(var(--accent)) ${((zoom - 1) / 2) * 100}%, hsl(var(--border)) ${((zoom - 1) / 2) * 100}%, hsl(var(--border)) 100%)`
                }}
              />
            </div>

            {/* Rotation Control */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <RotateCw className="w-4 h-4" />
                  {t('profile.crop.rotation')}
                </label>
                <span className="text-xs text-subtle">{rotation}°</span>
              </div>
              <input
                type="range"
                min={0}
                max={360}
                step={1}
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, hsl(var(--accent)) 0%, hsl(var(--accent)) ${(rotation / 360) * 100}%, hsl(var(--border)) ${(rotation / 360) * 100}%, hsl(var(--border)) 100%)`
                }}
              />
            </div>

            {/* Quick Rotation Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setRotation((rotation - 90 + 360) % 360)}
                className="btn btn-ghost text-xs"
              >
                <RotateCw className="w-4 h-4 transform -scale-x-100" />
                {t('profile.crop.rotateLeft')}
              </button>
              <button
                onClick={() => setRotation((rotation + 90) % 360)}
                className="btn btn-ghost text-xs"
              >
                <RotateCw className="w-4 h-4" />
                {t('profile.crop.rotateRight')}
              </button>
              <button
                onClick={() => setRotation(0)}
                className="btn btn-ghost text-xs ml-auto"
              >
                {t('profile.crop.resetRotation')}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="btn btn-ghost"
            >
              {t('profile.actions.cancel')}
            </button>
            <button
              onClick={handleSave}
              className="btn btn-primary"
            >
              <Check className="w-4 h-4" />
              {t('profile.actions.apply')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
