import { smallBox, bigBox, SmartMessageBox } from '../utils/actions/MessageActions';

const successColor = '#15a015';
const warningColor = '#f07e08';
const errorColor = '#af0202';

const successTimeout = 5000;
const warningTimeout = 5000;
const errorTimeout = 3000;

/* Messages will apper in the top-right of the page */
export function errorMessage(title, content, timeout) {
  smallBox({
    title: title || '',
    content: content || '',
    color: errorColor,
    icon: 'fa fa-warning shake animated',
    //number: '1',
    timeout: timeout || errorTimeout,
  });
}

export function successMessage(title, content, timeout) {
  smallBox({
    title: title || '',
    content: content || '',
    color: successColor,
    timeout: timeout || successTimeout,
    icon: 'fa fa-check',
    //number: '4'
  });
}

export function warningMessage(title, content, timeout) {
  smallBox({
    title: title || '',
    content: content || '',
    color: warningColor,
    timeout: timeout || warningTimeout,
    icon: 'fa fa-check',
    //number: '4'
  });
}

/* Notifications will apper in the bottom-right of the page */
export function errorNotify(title, content, timeout) {
  bigBox({
    title: title || '',
    content: content || '',
    color: errorColor,
    icon: 'fa fa-warning shake animated',
    number: '1',
    timeout: timeout || errorTimeout,
  });
}

export function successNotify(title, content, timeout) {
  bigBox({
    title: title || '',
    content: content || '',
    color: successColor,
    timeout: timeout || successTimeout,
    icon: 'fa fa-check',
    number: '2',
  });
}

export function warningNotify(title, content, timeout) {
  bigBox({
    title: title || '',
    content: content || '',
    color: warningColor,
    icon: 'fa fa-shield fadeInLeft animated',
    number: '3',
    timeout: timeout || warningTimeout,
  });
}

export function clearAll() {
  $('#divbigBoxes').remove();
  $('#divMiniIcons').remove();
}

export function MessageBoxInfo(title, content, cb) {
  SmartMessageBox(
    {
      title: `<i class='glyphicon glyphicon-share-alt' style='color:green'></i> ${title}`,
      content: content,
      buttons: '[No][Yes]',
    },
    (ButtonPressed) => {
      if (ButtonPressed == 'Yes') {
        if (typeof cb === 'function') cb();
      }
    }
  );
}

export function MessageBoxWarning(title, content, cb) {
  SmartMessageBox(
    {
      title: `<i class='glyphicon glyphicon-share-alt' style='color:red'></i> ${title}`,
      content: content,
      buttons: '[No][Yes]',
    },
    (ButtonPressed) => {
      if (ButtonPressed == 'Yes') {
        if (typeof cb === 'function') cb();
      }
    }
  );
}
