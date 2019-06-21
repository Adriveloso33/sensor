export default function TimePlugin(config = {}) {
  return (fpInstance) => {
    const handleListClick = (e) => {
      if (!e.target.classList.contains('hourListItem')) return;

      e.preventDefault();
      toggleHourStatus(e.target.id);
      notifyChanges();
    };

    const toggleHourStatus = (id) => {
      if (isHourActive(id)) removeHour(id);
      else activeHour(id);
    };

    const isHourActive = (id) => {
      return this.selectedHours.indexOf(id) !== -1;
    };

    const activeHour = (id) => {
      this.selectedHours.push(id);
      toggleActiveClass(id);
    };

    const removeHour = (id) => {
      this.selectedHours = this.selectedHours.filter((hourId) => hourId !== id);
      toggleActiveClass(id);
    };

    const clearAllSelectedHours = () => {
      this.selectedHours.forEach((id) => {
        removeHour(id);
      });
    };

    const toggleActiveClass = (id) => {
      getHourElementById(id).classList.toggle('activeHour');
    };

    const notifyChanges = () => {
      const { onChange } = config;
      if (typeof onChange === 'function') onChange(getFormattedHourList());
    };

    const getFormattedHourList = () => {
      return this.selectedHours.map((id) => {
        return getHourElementById(id).innerHTML;
      });
    };

    const getHourElementById = (id) => {
      const parentNode = this.hoursList.getElementsByClassName('hoursList')[0];
      return parentNode.getElementsByClassName(`hourListItem-${id}`)[0];
    };

    const insertClearButton = (fp) => {
      const clearButtonNode = document.getElementById('clearButtonContainer').cloneNode(true);
      clearButtonNode.style.display = 'block';
      clearButtonNode.addEventListener('click', () => {
        clearAllSelectedHours();
        notifyChanges();
      });

      fp.monthNav.childNodes[1].appendChild(clearButtonNode);
    };

    this.isStyleSet = false;

    this.hoursList = document.getElementById('hoursListContainer').cloneNode(true);
    this.hoursList.style.display = 'block';
    this.hoursList.addEventListener('click', handleListClick);

    this.selectedHours = Array(24)
      .fill()
      .map((e, i) => i.toString());

    if (Array.isArray(config.selectedHours)) {
      this.selectedHours = config.selectedHours.map((formattedHour) => {
        try {
          return moment(formattedHour, 'HH:mm')
            .format('H')
            .toString();
        } catch (Ex) {
          console.warn('Invalid hour format');
        }
      });
    }

    this.selectedHours.forEach((id) => {
      toggleActiveClass(id);
    });

    return {
      onOpen: (date, dateAsString, fp) => {
        if (!this.isStyleSet) {
          const currentWidth = fp.calendarContainer.offsetWidth;
          fp.calendarContainer.style.width = `${currentWidth + 120}px`;
          this.isStyleSet = true;

          if (config.clearButton) insertClearButton(fpInstance);
        }

        const currentHeight = fp.rContainer.offsetHeight;
        this.hoursList.style.height = `${currentHeight - 10}px`;
        fpInstance.calendarContainer.appendChild(this.hoursList);
      },
    };
  };
}
