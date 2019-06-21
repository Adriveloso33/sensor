export function getRegionColor(_this, regionName, kpi) {
  let value = this.getRegionValue(regionName, kpi);
  let regionColor = 'white';

  if (threshold[kpi] && value) {
    let ranges = threshold[kpi];

    ranges &&
      ranges.forEach((r) => {
        let { min, max, color } = r;

        if (min && max && value >= min && value <= max) regionColor = color;
        if (!min && value <= max) regionColor = color;
        if (!max && value >= min) regionColor = color;
      });
  }

  return regionColor;
}
