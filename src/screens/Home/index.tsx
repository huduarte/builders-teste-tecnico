import React, {useEffect, useState} from 'react'

import {
  Container, 
  City, 
  Temp, 
  Header, 
  Data, 
  Description, 
  Temperature, 
  Celsius, 
  WeatherData,
  Button,
} from './styles'

import WeatherAnimation from '@components/WeatherAnimation'

import LargeButton from '@components/LargeButton'
import WeatherCard from '@components/WeatherCard'
import Loader from '@components/Loader'
import { IResolveWeather, ResolveWeather } from '@utils/resolvers'
import { convertKelvinToCelsius } from '@utils/converter'
import { useWeather } from '@hooks/weather'

import { RootStackParamList } from '@routes/stack.routes'

import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Alert } from 'react-native'
type MainScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Main'
>;

type Props = {
  route: {
    params: {
      day: 'day' | 'night'
    }
  }
  navigation: MainScreenNavigationProp;
};

const Home = ({ route, navigation }: Props): JSX.Element => {
  const [resolvedWeather, setResolvedWeather] = useState({} as IResolveWeather)

  const {day} = route.params

  const {
    weatherData,
    updateWeatherData
  } = useWeather()

  const handlePressUpdateData = async () => {
    updateWeatherData().catch(() =>{
      Alert.alert('Ops!', 'Houve um problema ao carregar os dados, por favor, tente novamente!')
      navigation.popToTop()
    })
  }

  useEffect(() => {
    if(weatherData){
      const resolvedWeather = ResolveWeather(weatherData?.weather[0]?.id, day)
      setResolvedWeather(resolvedWeather)
    }
  }, [weatherData])

  return (
    <Container type={day} colors={[]}>
      {!weatherData && (
        <Loader dayPeriod={day} />
      )}
      {weatherData && (
        <Header>
          <Data>
            <City>{weatherData.name}</City>
            <Temperature>
              <Temp>{convertKelvinToCelsius(weatherData.main.temp)}</Temp>
              <Celsius>°</Celsius>
            </Temperature>
          </Data>

          <Description>{weatherData.weather[0].description}</Description>
        </Header>
      )}

      {weatherData && resolvedWeather.animation && 
        <WeatherAnimation 
          source={resolvedWeather.animation} 
          description={resolvedWeather.description} 
        />
      }

      {weatherData && (
        <>
          <WeatherData>
            <WeatherCard 
              humidity={weatherData.main.humidity}
              pressure={weatherData?.main.pressure}
              windSpeed={weatherData?.wind.speed}
            />
          </WeatherData>
          <Button>
            <LargeButton title="Atualizar os dados" type={day} onPress={handlePressUpdateData} />
          </Button>
        </>
      )}

    </Container>
  )
}

export default Home
