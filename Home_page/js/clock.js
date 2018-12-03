/**
 * "Broken Line" Minimalist Clock
 * Based on Lukas Avenas "Broken Line"
 * https://www.behance.net/gallery/28569407/broken-line
 * @author Mike King (@micjamking) 
 */
(function(){
  'use strict';
  
  /** 
   * Creates a new clock
   * @constructor
   */
  function Clock(){
    
    /** 
     * Length of an hour in degrees
     * @constant {number} HOUR_DEG 360 degrees / 12 hours
     */
    this.HOUR_DEG = 30;
    
    /** 
     * Length of a minute & second in degrees
     * @constant {number} MIN_SEC_DEG 360 degrees / 60 (minutes || seconds)
     */
    this.MIN_SEC_DEG = 6;
    
    /** 
     * The current date
     * @type {date}
     */
    this.date;
    
    /** 
     * The iteration counter
     * Keep looping instead of rewinding
     * when transitioning from 360deg to 0deg
     * @type {Object}
     */
    this.iteration = {
      sec: 0,
      min: 0,
      hour: 0
    };
    
    /** 
     * Reference to the hour hand
     */
    this.hour = document.querySelector('.hour');
    
    /** 
     * Reference to the minute hand
     */
    this.min = document.querySelector('.minutes');
    
    
    /** 
     * Reference to the second hand
     */
    this.sec = document.querySelector('.seconds');
  }
  
  /**
   * Get hour and set degree of rotation
   */
  Clock.prototype.getHour = function(){
    // Use 12-hour clock (if PM, minus 12)
    var hour = this.date.getHours();
    hour = (hour > 12) ? hour - 12 : hour;
    
    // Set current hour in degrees
    var degree = 'rotate(' + ((this.HOUR_DEG * (this.date.getMinutes() / 60)) + (this.HOUR_DEG * hour)) + 'deg)';
    
    // Apply the degree
    if (this.hour){
      if (hour === 12 && this.date.getMinutes() === 59){
        ++this.iteration.hour;
      }
      
      this.hour.style.webkitTransform = degree;
      this.hour.style.transform       = degree;
    }
  };
  
  /**
   * Get minute and set degree of rotation
   */
  Clock.prototype.getMinutes = function(){
    // Set current minute in degrees
    var degree = 'rotate(' + (this.MIN_SEC_DEG * this.date.getMinutes() + (this.iteration.min  * 360)) + 'deg)';
    
    // Apply the degree
    if (this.min){
      if (this.date.getMinutes() === 59 && 
          this.date.getSeconds() === 59){
        ++this.iteration.min;
      }
      
      this.min.style.webkitTransform = degree;
      this.min.style.transform       = degree;
    }
  };
  
  /**
   * Get seconds and set degree of rotation
   */
  Clock.prototype.getSeconds = function(){
    // Set current seconds in degrees
    var degree = 'rotate(' + (this.MIN_SEC_DEG * this.date.getSeconds() + (this.iteration.sec  * 360)) + 'deg)';
    
    // Apply the degree
    if (this.sec){
      if (this.date.getSeconds() === 59){
        ++this.iteration.sec;
      }
      this.sec.style.webkitTransform = degree;
      this.sec.style.transform       = degree;
    }
  };

  /**
   * Get AM/PM and set color scheme
   */
  Clock.prototype.getPeriod = function(){
    var html = document.documentElement;
    var isAverageDayTime = (this.date.getHours() > 6) && (this.date.getHours() < 18);
    html.className = isAverageDayTime ? 'day' : 'night';
  };
  
  /**
   * Clock initialization
   */
  Clock.prototype.init = function(){
    // Fire clock functions once per sec
    setInterval((function(){
    	this.date = new Date();
      this.getHour();
      this.getMinutes();
      this.getSeconds();
      this.getPeriod();
    }).bind(this), 1000);
  };
   
  /**
   * Can I kick it?...
   * @constructs Clock
   */
  var clock = new Clock();
  
  /**
   * ...YES YOU CAN!
   */
  clock.init();
})();