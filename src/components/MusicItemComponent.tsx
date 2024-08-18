import React from "react";
import {
	Image,
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Linking
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

type MusicItem = {
	musicItem: string;
	id: string;
	name: string;
	imageURL: string;
	spotifyURI: string;
};

type MusicItemProps = {
	musicItem: MusicItem;
};

const MusicItemComponent: React.FC<MusicItemProps> = ({ musicItem }) => {
	return (
		<View style={styles.card}>
			<Image
				source={{ uri: musicItem.imageURL }}
				style={styles.image}
			/>
			<View style={{ flex: 1, padding: 16, justifyContent: "center" }}>
				<Text style={styles.text}>{musicItem.name}</Text>
				<Text style={{ color: "#7D7D7D", paddingTop: 4 }}>
					{musicItem.musicItem}
				</Text>
			</View>
			<TouchableOpacity
				style={styles.playButton}
				onPress={async () => Linking.openURL(musicItem.spotifyURI)}
			>
				<FontAwesomeIcon
					icon={faPlay}
					size={24}
				/>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		height: 96,
		display: "flex",
		flexDirection: "row",
		alignItems: "center"
	},
	image: { height: 64, width: 64, margin: 1, marginLeft: 16, borderRadius: 5 },
	text: {
		fontSize: 20,
		color: "#FCFCFC"
	},
	playButton: {
		height: 48,
		width: 48,
		backgroundColor: "#1DB954",
		borderRadius: "50%",
		display: "flex",
		justifyContent: "center",
		alignItems: "center"
	}
});

export default MusicItemComponent;
