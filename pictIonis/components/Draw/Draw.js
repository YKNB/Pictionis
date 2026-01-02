import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Modal } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import CanvasDraw from 'react-canvas-draw';
import AppButton from '../AppButton';
import Colors from '../../utils/colors';
import { database } from '../Firebase/firebase';
import { AuthUserContext } from '../../navigation/AuthUserProvider';
import { storage } from '../Firebase/firebase';


export default function DrawComponent({
  game,
  setShowColorPicker,
  showColorPicker,
}) {
  const { user } = useContext(AuthUserContext);
  const ref = useRef();
  const basePath = `/games/${game.uid}/draw`;
  const [canvasLayout, setCanvasLayout] = useState();
  const [strokeWidth, setStrokeWidth] = useState(3);
  const isAuthGame = user._delegate.uid === game.createdBy;
  const [imageUrl, setImageUrl] = useState('');
  const [strokeColor, setStrokeColor] = useState('#000000'); // Couleur par défaut

  const addPath = (path) => {
    const gameData = path.val();
  
    if (gameData.draw) {
      const saveData = JSON.stringify({
        lines: gameData.draw.lines.map((line) => ({
          ...line,
          points: line.points.map((point) => ({
            x: point.x * canvasLayout.width,
            y: point.y * canvasLayout.height,
          })),
        })),
        width: gameData.draw.width * canvasLayout.width,
        height: gameData.draw.height * canvasLayout.height,
      });
  
      ref.current.loadSaveData(saveData, true);
    }
  };

  const onLoad = async () => {
    console.log("Load button clicked");
    
    try {
      const imageUrl = await getImageUrlFromStorage();
      setImageUrl(imageUrl);
    } catch (error) {
      console.error('Error loading image:', error);
    }
  };

  const getImageUrlFromStorage = async () => {
    const imageName = `${game.uid}_${user._delegate.uid}.png`;
    const storageRef = storage.ref(`/images/${imageName}`);
    
    return await storageRef.getDownloadURL();
  };

  const onClear = () => {
    ref.current.clear();
    database.ref(basePath).remove();
    database.ref(`/games/${game.uid}/clear`).push({
      clearedAt: new Date().toISOString(),
    });
  };

  const onUndo = () => {
    const paths = ref.current.getSaveData();
    if (paths) {
      database.ref(basePath).set(JSON.parse(paths));
    }
  };

  const onSave = async () => {
    const drawingData = ref.current.getSaveData();
    if (drawingData) {
      try {
        const uri = await captureRef(ref.current, {
          format: 'png',
          quality: 1,
        });
  
        const response = await fetch(uri);
        const blob = await response.blob();
  
        const imageName = `${game.uid}_${user._delegate.uid}.png`;
  
        const storageRef = storage.ref(`/images/${imageName}`);
        await storageRef.put(blob);
  
        const imageUrl = await storageRef.getDownloadURL();
  
        const existingImageRef = database.ref('images').orderByChild('gameId').equalTo(game.uid);
        existingImageRef.once('value', (snapshot) => {
          if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
              const imageId = childSnapshot.key;
              database.ref(`images/${imageId}`).update({ imageUrl: imageUrl });
            });
          } else {
            const newImageData = {
              imageUrl: imageUrl,
              gameId: game.uid,
              userId: user._delegate.uid,
              createdAt: new Date().toISOString(),
            };
            database.ref('images').push(newImageData);
          }
        });
  
        console.log('Image uploaded successfully!');
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

 

  useEffect(() => {
    if (canvasLayout) {
      const onDrawAdded = database
        .ref(basePath)
        .on('child_added', (path) => addPath(path));

      const onDrawChanged = database
        .ref(basePath)
        .on('child_changed', (path) => {
          ref.current.clear();
          addPath(path);
        });
      
      const onDrawRemoved = database
        .ref(basePath)
        .on('child_removed', (path) =>
          ref.current.deletePath(parseInt(path.key))
        );

      const clearPath = `/games/${game.uid}/clear`;
      const onDrawClear = database.ref(clearPath).on('child_added', () => {
        database.ref(clearPath).remove();
        ref.current.clear();
      });

      return () => {
        database.ref(basePath).off('child_added', onDrawAdded);
        database.ref(basePath).off('child_changed', onDrawChanged);
        database.ref(basePath).off('child_removed', onDrawRemoved);
        database.ref(clearPath).off('child_added', onDrawClear);
      };
    }
  }, [canvasLayout]);
 
  const handleColorChange = (event) => {
    setStrokeColor(event.target.value);
  };

  return (
    <View style={{ flex: 1, flexDirection: 'row', display: showColorPicker ? 'none' : 'flex' }}>
      <View style={{ flex: 1, flexDirection: 'column', borderBottomWidth: 1, borderColor: Colors.primary }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, borderBottomWidth: 1, borderColor: Colors.primary }}>
          <View style={{ flexDirection: 'row', width: '100%' }}>
            {isAuthGame ? (
              <>
                <AppButton title="Clear" style={{ width: 100, marginRight: 10, marginLeft: 10 }} onPress={onClear} />
                <AppButton title="Undo" onPress={onUndo} style={{ width: 100, marginRight: 10 }} />
                <TouchableOpacity onPress={() => { setStrokeWidth(strokeWidth + 3); if (strokeWidth > 50) { setStrokeWidth(3); } }} style={{ marginHorizontal: 2.5, marginVertical: 8, width: 55, height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.primary }}>
                  <View style={{ backgroundColor: strokeColor, marginHorizontal: 2.5, width: Math.sqrt(strokeWidth / 3) * 10, height: Math.sqrt(strokeWidth / 3) * 10, borderRadius: (Math.sqrt(strokeWidth / 3) * 10) / 2 }} />
                </TouchableOpacity>
                {/* <TouchableOpacity onPress={openColorPicker} style={{ width: 50, marginRight: 10, position: 'absolute', right: 10, bottom: 0, top: 0, backgroundColor: strokeColor }} /> */}
                <AppButton title="Save" onPress={onSave} style={{ width: 100, marginRight: 10 }} />
                <AppButton title="Load" onPress={onLoad} style={{ width: 100, marginRight: 10 }} />
                <input
                  type="color"
                  value={strokeColor}
                  onChange={handleColorChange}
                  style={{ width: 50, height: 50 }}
                />
              </>
            ) : (
              <Text style={{ textAlign: 'center', fontSize: 17, width: '100%', marginTop: 20, marginBottom: 17 }}>
                {game.name}
              </Text>
            )}
          </View>
        </View>
        <View onLayout={(e) => setCanvasLayout(e.nativeEvent.layout)} style={{ flex: 1, flexDirection: 'row' }}>
          <CanvasDraw
            ref={ref}
            brushColor={strokeColor}
            brushRadius={strokeWidth / 3}
            style={{ flex: 1 }}
            lazyRadius={0}
            canvasWidth={300}
            canvasHeight={300}
            disabled={!isAuthGame}
          />
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={{ position: 'absolute', width: 300, height: 300 }} />
          ) : null}
        </View>
      </View>
    </View>
  );
}