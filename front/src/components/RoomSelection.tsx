import React from 'react';
import styled from 'styled-components';
import {
  Title,
  Subtitle,
  Card,
  Grid,
  Feature,
  BackButton,
  ThemeProps
} from './shared/CommonStyles';
import { rooms } from './shared/RoomTypes';

interface RoomSelectionProps {
  mode: 'light' | 'dark';
  onRoomSelected: (room: string) => void;
  selectedRoom: string;
  onBack?: () => void;
}

interface RoomCardProps {
  isSelected: boolean;
}

const MovieIcon = styled.div<ThemeProps>`
  font-size: 40px;
  margin-bottom: 1rem;
`;

const SelectedBadge = styled.div`
  background: rgba(75, 181, 67, 0.1);
  color: #4BB543;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const RoomButton = styled.button<RoomCardProps>`
  width: 100%;
  padding: 20px;
  margin: 10px 0;
  border: 2px solid transparent;
  border-radius: 12px;
  background: rgba(255, 253, 250, 0.9);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  ${({ isSelected }: RoomCardProps) =>
    isSelected &&
    `
    border-color: #4BB543;
    box-shadow: 0 4px 12px rgba(75, 181, 67, 0.15);
    background: rgba(255, 255, 255, 0.95);
  `}
`;

const RoomHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 1rem;
`;

const RoomName = styled.h3`
  font-size: 1.5rem;
  margin: 0 0 8px 0;
  color: #1a1a1a;
`;

const RoomPrice = styled.span`
  font-size: 1.2rem;
  color: #1a1a1a;
  font-weight: bold;
  margin-left: 12px;
`;

const RoomType = styled.span`
  font-size: 1rem;
  color: #41E1E1;
  font-weight: bold;
  background: rgba(65, 225, 225, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  display: inline-block;
  margin-bottom: 8px;
`;

const RoomDescription = styled.p`
  font-size: 0.9rem;
  color: #4a4a4a;
  margin: 8px 0;
  line-height: 1.4;
`;

const SeatsInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.85rem;
  color: #4a4a4a;
  margin: 8px 0;
  
  span {
    color: #41E1E1;
    font-size: 1rem;
  }
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 12px;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8rem;
  color: #4a4a4a;
  
  span.icon {
    color: #41E1E1;
    font-size: 0.9rem;
    min-width: 16px;
    text-align: center;
  }
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

const RoomSelection: React.FC<RoomSelectionProps> = ({ mode, onRoomSelected, selectedRoom, onBack }) => {
  return (
    <MainContent>
      <HeaderContainer>
        <MovieIcon currentTheme={mode}>
          🎬
        </MovieIcon>
        <Title currentTheme={mode}>Selecciona una Sala</Title>
        <Subtitle currentTheme={mode}>Elige la sala que mejor se adapte a tu experiencia cinematográfica</Subtitle>
      </HeaderContainer>

      <Grid>
        {Object.values(rooms).map((room) => (
          <RoomButton
            key={room.id}
            isSelected={selectedRoom === room.id}
            currentTheme={mode}
            onClick={() => onRoomSelected(room.id)}
          >
            <RoomHeader>
              <RoomName>{room.name}</RoomName>
              <RoomPrice>{room.price}</RoomPrice>
            </RoomHeader>
            <RoomType>{room.type}</RoomType>
            <RoomDescription>{room.description}</RoomDescription>
            <SeatsInfo>
              <span>🪑</span> {room.capacity} asientos
            </SeatsInfo>
            <FeatureList>
              {room.features.map((feature, index) => (
                <FeatureItem key={index}>
                  <span className="icon">{feature.icon}</span>
                  {feature.text}
                </FeatureItem>
              ))}
            </FeatureList>
            {selectedRoom === room.id && (
              <SelectedBadge>
                <span>✓</span> Sala seleccionada
              </SelectedBadge>
            )}
          </RoomButton>
        ))}
      </Grid>

      {onBack && <BackButton currentTheme={mode} onClick={onBack}>← VOLVER A DETALLES</BackButton>}
    </MainContent>
  );
};

export default RoomSelection;
