import React from 'react';
import styled from 'styled-components';
import {
  Title,
  Subtitle,
  BackButton,
  ThemeProps
} from './shared/CommonStyles';
import { rooms } from './shared/RoomTypes';

interface RoomDetailsProps {
  mode: 'light' | 'dark';
  selectedRoom: string;
  onBack?: () => void;
}

const MovieIcon = styled.div<ThemeProps>`
  font-size: 40px;
  margin-bottom: 1rem;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 2rem;
`;

const MainContent = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: rgba(255, 255, 255, 0);
`;

const RoomImage = styled.img<ThemeProps>`
  width: 100%;
  max-width: 1000px;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 2rem;
  border: 2px solid transparent;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeatureCard = styled.div`
  padding: 20px;
  border-radius: 12px;
  background: rgba(255, 253, 250, 0.9);
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  color: #41E1E1;
  min-width: 40px;
  text-align: center;
`;

const FeatureContent = styled.div`
  flex: 1;
`;

const FeatureTitle = styled.h3`
  font-size: 1.1rem;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
`;

const FeatureDescription = styled.p`
  font-size: 0.9rem;
  color: #4a4a4a;
  margin: 0;
  line-height: 1.4;
`;

const RoomDetails: React.FC<RoomDetailsProps> = ({ mode, selectedRoom, onBack }) => {
  const room = rooms[selectedRoom];

  if (!room) {
    return (
      <MainContent>
        <HeaderContainer>
          <MovieIcon currentTheme={mode}>
            🎬
          </MovieIcon>
          <Title currentTheme={mode}>Sala no encontrada</Title>
        </HeaderContainer>
      </MainContent>
    );
  }

  return (
    <MainContent>
      <HeaderContainer>
        <MovieIcon currentTheme={mode}>
          🎬
        </MovieIcon>
        <Title currentTheme={mode}>{room.name}</Title>
        <Subtitle currentTheme={mode}>Descubre todas las características de esta sala</Subtitle>
      </HeaderContainer>

      <RoomImage 
        currentTheme={mode} 
        src={`/images/${selectedRoom}.jpg`} 
        alt={room.name} 
      />

      <FeatureGrid>
        {(room.detailedFeatures || []).map((feature, index) => (
          <FeatureCard key={index}>
            <FeatureIcon>{feature.icon}</FeatureIcon>
            <FeatureContent>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
            </FeatureContent>
          </FeatureCard>
        ))}
      </FeatureGrid>

      {onBack && (
        <BackButton currentTheme={mode} onClick={onBack}>
          ← VOLVER A SELECCIÓN
        </BackButton>
      )}
    </MainContent>
  );
};

export default RoomDetails; 