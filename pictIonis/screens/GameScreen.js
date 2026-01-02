import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import DrawComponent from '../components/Draw/Draw';
import Chat from '../components/Chat/Chat';
import Colors from '../utils/colors';
import Form from '../components/Forms/Form';
import FormField from '../components/Forms/FormField';
import FormButton from '../components/Forms/FormButton';
import { AuthUserContext } from '../navigation/AuthUserProvider';
import * as Yup from 'yup';
import { database } from '../components/Firebase/firebase';

const validationSchema = Yup.object().shape({
  word: Yup.string(),
});

export default function GameScreen({ navigation, route }) {
  const { game } = route.params;
  const { user } = useContext(AuthUserContext);
  // const [strokeColor, setStrokeColor] = useState(toHsv('lightGrey'));
  const [showColorPicker] = useState(false);
  const isAuthGame = user._delegate.uid === game.createdBy;
  const winnerPath = `games/${game.uid}/winner`;
  const [imageUrl, setImageUrl] = useState('');

// Déclarez une fonction pour mettre à jour la couleur du pincea

  useEffect(() => {
    if (!game) navigation.navigate('Home');

    const onWin = database.ref(winnerPath).on('child_added', (winner) =>
      navigation.navigate('GameWin', {
        winner: winner.val(),
        game,
      })
    );

    return () => database.ref(winnerPath).off('child_added', onWin);
  }, []);

  useEffect(() => {
    if (game && game.uid) {
      const gameId = game.uid;
      const imagesRef = database.ref('images').orderByChild('gameId').equalTo(gameId);
      imagesRef.once('value', (snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
            const imageData = childSnapshot.val();
            const imageUrl = imageData.imageUrl;
            // Mettez à jour l'état de l'URL de l'image associée au jeu
            setImageUrl(imageUrl);
          });
        } else {
          console.log('Aucune image associée au jeu.');
        }
      });
    }
  }, [game]);

  const onSubmit = ({ word }) => {
    if (word?.toLowerCase() === game.word.toLowerCase()) {
      database.ref(winnerPath).push({
        createdBy: user._delegate.uid,
        name: user.name,
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, display: showColorPicker ? 'none' : 'flex' }}>
        {!isAuthGame && imageUrl !== '' && (
          <Image
            source={{ uri: imageUrl }} // Utilisez l'URL de l'image associée au jeu
            style={{ width: '100%', height: 300 }}
          />
        )}
        {isAuthGame && (
          <DrawComponent
            game={game}
          />
        )}
        {!isAuthGame && (
          <View style={{ padding: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
            <Form
              initialValues={{ word: '' }}
              validationSchema={validationSchema}
              onSubmit={(values) => onSubmit(values)}
            >
              <FormField
                name="word"
                width={'67%'}
                placeholder="Enter the word to guess"
              />
              <FormButton title="Submit" style={{ width: '30%' }} />
            </Form>
          </View>
        )}
        <Chat game={game} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.mediumGrey,
  },
});
