import React, {Component} from 'react';
import {
    View,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    Keyboard,
    LayoutAnimation
} from 'react-native';
import {
    Container,
    Title,
    Content,
    Header,
    Body,
    Text,
    H1,
    H2,
    H3,
    List,
    ListItem,
    Footer,
    FooterTab,
    Button,
    Icon
} from 'native-base';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import I18n from 'react-native-i18n';
import {StackNavigator, TabNavigator} from 'react-navigation';
import {downloadAudio} from '../actions/api';
import {setCurrentTab} from '../actions/index';
import Tabs from '../components/Tabs';

class _MyProfile extends Component {
    static navigationOptions = {
        title: 'Me'
    };

    render() {
        const sectionInfo = {
            url: "http://media.blubrry.com/foundersnextdoor/content.blubrry.com/foundersnextdoor/Episode_006_V_Orban_final.mp3",
            id: 1
        };

        return (
            <Container>
                <Header>
                    <Body>
                    <Text>My profile</Text>
                    </Body>
                </Header>
                <Content>

                </Content>

                <Tabs
                    navigation={this.props.navigation}
                    currentTab={this.props.currentTab}
                    setCurrentTab={this.props.setCurrentTab}
                />
            </Container>
        )
    }
}

function mapStateToProps(store) {
    return {currentTab: store.user.currentTab};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({downloadAudio, setCurrentTab}, dispatch)
}

export const MyProfile = connect(mapStateToProps, mapDispatchToProps)(_MyProfile);