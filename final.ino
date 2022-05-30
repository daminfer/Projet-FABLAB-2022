#include <DHT.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include "Adafruit_TSL2591.h"

DHT dht(7, DHT22);
Adafruit_TSL2591 tsl = Adafruit_TSL2591(2591);

int IN1 = 2;
int IN2 = 3;
int IN3 = 4;
int IN4 = 5;

int Pin1 = A0; 
int Pin2 = A1;
int Pin3 = A2;
int Pin4 = A3;

float value1 = 0;
float value2 = 0;
float value3 = 0;
float value4 = 0;

void configureSensor(void)
{

  tsl.setGain(TSL2591_GAIN_MED);

  tsl.setTiming(TSL2591_INTEGRATIONTIME_200MS);
}

void setup() {
  Serial.begin(9600);
  pinMode(IN1, OUTPUT);
  pinMode(IN2, OUTPUT);
  pinMode(IN3, OUTPUT);
  pinMode(IN4, OUTPUT);
  
  pinMode(Pin1, INPUT);
  pinMode(Pin2, INPUT);
  pinMode(Pin3, INPUT);
  pinMode(Pin4, INPUT);
  
  digitalWrite(IN1, LOW);
  digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW);
  digitalWrite(IN4, LOW);
 dht.begin();

 configureSensor();
}

void advancedRead(void)
{
  uint32_t lum = tsl.getFullLuminosity();
  uint16_t ir, full;
  ir = lum >> 16;
  full = lum & 0xFFFF;
  Serial.print(F("Lux: ")); Serial.print(tsl.calculateLux(full, ir), 6);
}

void loop() {

  Serial.print("Humidité plante 1: ");
  value1 = analogRead(Pin1);
  Serial.print(value1);
  int val = 120;
  //if(value1<550 && val >= 120)
  //{
     // digitalWrite(IN1, LOW);
     // val = 0;
  //}
  //else
  //{
   // digitalWrite(IN1, HIGH);
    //val = val + 1;
    //}
    
  Serial.print(" ,plante 2: ");
  value2 = analogRead(Pin2);
  Serial.print(value2);
  //if(value2<550 && val >= 120)
  //{
  //    digitalWrite(IN2, LOW);
  //    val = 0;
  //}
  //else
  //{
   // digitalWrite(IN2, HIGH); 
   // val = val + 1;
    
    //}

  Serial.print(" ,plante 3: ");
  value3 = analogRead(Pin3);
  Serial.print(value3);
  //if(value3<550 && val >= 120)
  //{
  //    digitalWrite(IN3, LOW);
  //    val = 0;
  //}
  //else
  //{
  //  digitalWrite(IN3, HIGH);
  //  val = val + 1;
    //}

  Serial.print(" ,plante 4: ");
  value4 = analogRead(Pin4);
  Serial.println(value4);
  //if(value4<550 && val >= 120)
  //{
  //    digitalWrite(IN4, LOW);
  //   val = 0;
  //}
  //else
  //{
  //  digitalWrite(IN4, HIGH);
  //  val = val + 1;
   //}

  float tauxHumidite = dht.readHumidity(); 
  float temperatureEnCelsius = dht.readTemperature(); 

  if (isnan(tauxHumidite) || isnan(temperatureEnCelsius)) {
    Serial.println ("pas de donnée capteur température !");
  }
  if (isnan(TSL2591_VISIBLE)){
    Serial.println ("pas de donnée capteur luminosité !");  
  }
  {
  advancedRead(); 
  Serial.println(", Humidite de l'air: " + String(tauxHumidite) +  "\%, Temp: "+ String(temperatureEnCelsius) + "°C\n" );
  delay(2000);
}}
