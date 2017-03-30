import React, { Component } from 'react';
import Divider from 'material-ui/Divider';
import {Card, CardMedia, CardTitle} from 'material-ui/Card';

import aboutStyle from './aboutStyle';

export default class About extends Component {
	render() {
		return(
			<div style={{padding: '20px 0'}}>
				<div style={ aboutStyle.headerContainer }>
					<div style={ aboutStyle.header } >Bridging the gap between music teachers and students</div>
					<div style={ aboutStyle.subheader } >
						by having an online platform to facilitate the search for music students and 
						the advertisements for music teachers.
					</div>

					<img src="../../images/music-banner.jpg" style={ aboutStyle.banner } />
				</div>
				<div style={{ display: 'none' }}>
					<div style={ aboutStyle.dividerContainer }>
                        <Divider style={ aboutStyle.dividerLeftMission } /> 
                        <b style={ aboutStyle.label } >Our Mission</b>
                        <Divider style={ aboutStyle.dividerRightMission } />
                    </div>
                    <div style={ aboutStyle.missionBlock } >
                    	Our mission is to bridge the gap between music teachers
                    	and students by having an online platform to facilitate
                    	the search for music students and the advertisements for
                    	music teachers. 
                    	<br /> <br />
                    	Put more stuff in here because its so empty. Well, this 
                    	is a paragraph that seems like it is saying something important,
                  		but it is not. Its mere purpose is to bulk up this chunk of 
                  		words. As meaningless as it may be, I dont even know what I 
                  		am saying anymore. Just enjoy reading this useless chunk of 
                  		words.
                		<br /> <br />
                  		I am surprised that you are still reading this even though I
                  		have stated clearly in the previous paragraph that all these
                  		words are just fillers. I am too lazy to search up Lorem Ipsum,
                  		so I am just sitting here typing away. Anyway, it is getting
                  		late, and I should go to bed lol. Good nights.
                  	</div>
				</div>

				<div>
					<div style={ aboutStyle.dividerContainer }>
                        <Divider style={ aboutStyle.dividerLeftTeam } /> 
                        <b style={ aboutStyle.label } >Our Team</b>
                        <Divider style={ aboutStyle.dividerRightTeam } />
                    </div>
                    <div style={{ padding: '0 30%' }} >
	                    <Card style={ aboutStyle.cardContainer }>
							<CardMedia>
								<img src="../../images/sophiepic.jpg" />
							</CardMedia>
							<CardTitle title="Sophie C." subtitle="Front-End Hacker" />
						</Card>
						<Card style={ aboutStyle.cardContainer }>
							<CardMedia>
								<img src="../../images/thanpic.jpg" />
							</CardMedia>
							<CardTitle title="Thanuree" subtitle="Back-End Genius" />
						</Card>
                    </div>
               </div>
			</div>
		);
	}
};